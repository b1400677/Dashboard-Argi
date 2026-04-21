/**
 * ============================================================
 *  DDA AGRO GROUP DASHBOARD – Apps Script Web API
 * ============================================================
 *  SHEETS (8):
 *   1. dim_commodities    5. fact_exports
 *   2. dim_regions        6. fact_farmer_income
 *   3. dim_markets        7. summary_by_commodity
 *   4. fact_production    8. summary_by_region
 * ============================================================
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const commodities = readSheet(ss, 'dim_commodities');
    const regions = readSheet(ss, 'dim_regions');
    const markets = readSheet(ss, 'dim_markets');
    const production = readSheet(ss, 'fact_production');
    const exports = readSheet(ss, 'fact_exports');
    const income = readSheet(ss, 'fact_farmer_income');
    const summaryComm = readSheet(ss, 'summary_by_commodity');
    const summaryReg = readSheet(ss, 'summary_by_region');

    const monthlyExports = aggregateBy(exports, ['month'], {
      volume_tons: r => r.volume_tons,
      value_usd: r => r.value_usd,
    }).sort((a,b) => String(a.month).localeCompare(String(b.month)));
    monthlyExports.forEach(m => {
      m.avg_price = m.volume_tons ? Math.round(m.value_usd / m.volume_tons) : 0;
    });

    const monthlyByCommodity = aggregateBy(exports, ['month','commodity_id'], {
      volume_tons: r => r.volume_tons, value_usd: r => r.value_usd,
    });

    const monthlyProdByComm = aggregateBy(production, ['month','commodity_id'], {
      production_tons: r => r.production_tons
    });

    const byMarket = aggregateBy(exports, ['market_id'], {
      volume_tons: r => r.volume_tons, value_usd: r => r.value_usd,
    }).sort((a,b) => b.value_usd - a.value_usd);
    const mktMap = {};
    markets.forEach(m => mktMap[m.market_id] = m);
    byMarket.forEach(b => {
      b.market_name = mktMap[b.market_id] ? mktMap[b.market_id].market_name : b.market_id;
      b.standard_level = mktMap[b.market_id] ? mktMap[b.market_id].standard_level : 'standard';
    });

    const commMarket = aggregateBy(exports, ['commodity_id','market_id'], {
      volume_tons: r => r.volume_tons, value_usd: r => r.value_usd,
    });

    const incomeTrend = aggregateBy(income, ['quarter','commodity_id'], {
      avg_net_per_ha_usd: r => r.net_per_ha_usd,
      avg_net_per_farmer_vnd: r => r.net_per_farmer_vnd,
      avg_farmgate_pct: r => r.farmgate_pct,
      total_farmers: r => r.total_farmers,
    });
    incomeTrend.forEach(it => {
      it.avg_net_per_ha_usd = Math.round(it.avg_net_per_ha_usd);
      it.avg_net_per_farmer_vnd = Math.round(it.avg_net_per_farmer_vnd);
      it.avg_farmgate_pct = Math.round(it.avg_farmgate_pct * 10) / 10;
    });

    const certByCommodity = aggregateBy(production, ['commodity_id'], {
      organic: r => r.organic_pct, globalgap: r => r.globalgap_pct,
      vietgap: r => r.vietgap_pct, conventional: r => r.conventional_pct,
    });
    certByCommodity.forEach(c => {
      ['organic','globalgap','vietgap','conventional'].forEach(k => c[k] = Math.round(c[k] * 10) / 10);
    });

    // KPIs
    const totalExportValue = exports.reduce((s,r) => s + Number(r.value_usd), 0);
    const totalExportVolume = exports.reduce((s,r) => s + Number(r.volume_tons), 0);
    const totalProduction = production.reduce((s,r) => s + Number(r.production_tons), 0);
    const totalHectares = regions.reduce((s,r) => s + Number(r.hectares), 0);
    const totalFarmers = regions.reduce((s,r) => s + Number(r.farmers), 0);

    const exp2024 = exports.filter(r => String(r.month).startsWith('2024')).reduce((s,r) => s + Number(r.value_usd), 0);
    const exp2023 = exports.filter(r => String(r.month).startsWith('2023')).reduce((s,r) => s + Number(r.value_usd), 0);
    const yoy = exp2023 ? (exp2024 - exp2023) / exp2023 * 100 : 0;

    const avgCertified = 100 - (production.reduce((s,r) => s + Number(r.conventional_pct), 0) / production.length);
    const avgEudr = production.reduce((s,r) => s + Number(r.eudr_ready_pct), 0) / production.length;
    const avgLoss = production.reduce((s,r) => s + Number(r.post_harvest_loss_pct), 0) / production.length;

    const euExports = exports.filter(r => r.market_id === 'EU').reduce((s,r) => s + Number(r.value_usd), 0);
    const euShare = totalExportValue ? euExports / totalExportValue * 100 : 0;

    const latestQ = '2025-Q1';
    const latestIncome = income.filter(r => r.quarter === latestQ);
    const avgFarmerIncome = latestIncome.length ? latestIncome.reduce((s,r) => s + Number(r.net_per_farmer_vnd), 0) / latestIncome.length : 0;
    const avgFarmgate = latestIncome.length ? latestIncome.reduce((s,r) => s + Number(r.farmgate_pct), 0) / latestIncome.length : 0;

    const agriKpis = {
      total_commodities: commodities.length,
      total_regions: regions.length,
      total_hectares: totalHectares,
      total_farmers: totalFarmers,
      total_markets: markets.length,
      production_tons_24m: Math.round(totalProduction),
      export_volume_tons_24m: Math.round(totalExportVolume),
      export_value_usd_24m: Math.round(totalExportValue),
      export_value_annualized_usd: Math.round(totalExportValue / 2),
      avg_price_usd_per_ton: totalExportVolume ? Math.round(totalExportValue / totalExportVolume) : 0,
      yoy_export_growth_pct: Math.round(yoy * 10) / 10,
      certified_pct: Math.round(avgCertified * 10) / 10,
      eudr_ready_pct: Math.round(avgEudr * 10) / 10,
      post_harvest_loss_pct: Math.round(avgLoss * 10) / 10,
      eu_share_pct: Math.round(euShare * 10) / 10,
      avg_farmer_income_q_vnd: Math.round(avgFarmerIncome),
      avg_farmgate_pct: Math.round(avgFarmgate * 10) / 10,
    };

    const payload = {
      agri_kpis: agriKpis,
      dim_commodities: commodities,
      dim_regions: regions,
      dim_markets: markets,
      monthly_exports: monthlyExports,
      monthly_by_commodity: monthlyByCommodity,
      monthly_prod_by_commodity: monthlyProdByComm,
      by_market: byMarket,
      comm_market: commMarket,
      income_trend: incomeTrend,
      cert_by_commodity: certByCommodity,
      summary_by_commodity: summaryComm,
      summary_by_region: summaryReg,
      meta: {
        source: 'google_sheets_live',
        company: 'Tập đoàn Nông Sản Đông Dương',
        period: '2023-04 → 2025-03',
      }
    };

    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      error: true, message: err.message, stack: err.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function readSheet(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error('Không tìm thấy sheet: "' + sheetName + '"');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h => String(h).trim());
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((key, idx) => {
      let v = row[idx];
      if (v instanceof Date) v = Utilities.formatDate(v, 'UTC', 'yyyy-MM-dd');
      if (v === null || v === undefined) v = '';
      obj[key] = v;
    });
    return obj;
  });
}

function aggregateBy(rows, groupCols, metrics) {
  const agg = {};
  rows.forEach(r => {
    const key = groupCols.map(c => r[c]).join('|');
    if (!agg[key]) {
      agg[key] = {};
      groupCols.forEach(c => agg[key][c] = r[c]);
      Object.keys(metrics).forEach(m => agg[key][m] = []);
    }
    Object.keys(metrics).forEach(m => {
      const fn = metrics[m];
      if (fn === 'count') agg[key][m].push(1);
      else agg[key][m].push(Number(fn(r)) || 0);
    });
  });
  return Object.values(agg).map(obj => {
    const result = {};
    groupCols.forEach(c => result[c] = obj[c]);
    Object.keys(metrics).forEach(m => {
      if (metrics[m] === 'count') result[m] = obj[m].length;
      else if (m.startsWith('avg_')) result[m] = obj[m].reduce((a,b)=>a+b,0) / obj[m].length;
      else result[m] = obj[m].reduce((a,b)=>a+b,0);
    });
    return result;
  });
}

/**
 * SIGNATURE: EUDR Compliance Gap Analysis (critical for 2026)
 * EU Deforestation Regulation requires traceability by Dec 2025 → full enforcement 2026
 */
function auditEUDRGap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const regions = readSheet(ss, 'summary_by_region');
  const commodities = readSheet(ss, 'summary_by_commodity');

  Logger.log('=== EUDR COMPLIANCE GAP (2026 CRITICAL) ===');
  Logger.log('Commodities with EU exports exceeding EUDR readiness:');
  Logger.log('');

  commodities.filter(c => Number(c.eudr_ready_pct) < 80).sort((a,b) => Number(a.eudr_ready_pct) - Number(b.eudr_ready_pct)).forEach(c => {
    const gap = 100 - Number(c.eudr_ready_pct);
    Logger.log(c.name_vi + ' · EUDR ' + c.eudr_ready_pct + '% · Gap ' + gap.toFixed(0) + '% · Export $' + Math.round(Number(c.export_value_usd)/2/1e6) + 'M/yr');
  });

  Logger.log('');
  Logger.log('=== ACTIONS REQUIRED ===');
  Logger.log('1. Deploy GPS-based plot mapping for all EU-destined exports');
  Logger.log('2. Engage Simexco Daklak / EDE Company model for traceability');
  Logger.log('3. Cross-reference with MAE monitoring tools (136,000 ha coverage)');
  Logger.log('4. Third-party verification by SGS / Bureau Veritas / Control Union');
  Logger.log('5. Due diligence statements per EUDR Article 10');
  Logger.log('');
  Logger.log('REGIONS AT HIGH RISK:');
  regions.filter(r => r.cert_level === 'low' || r.cert_level === 'medium')
    .sort((a,b) => Number(a.eudr_ready_pct) - Number(b.eudr_ready_pct))
    .slice(0, 5)
    .forEach(r => {
      Logger.log('  ' + r.region_name + ' · EUDR ' + r.eudr_ready_pct + '% · Cert level ' + r.cert_level);
    });
}

/**
 * Yield Gap Analysis - where to invest in productivity
 */
function analyzeYieldGap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const summary = readSheet(ss, 'summary_by_commodity');

  Logger.log('=== YIELD GAP ANALYSIS ===');
  Logger.log('Commodity · Current · Target · VN Avg · World · Gap to Target');
  Logger.log('-----------------------------------------------------------');
  summary.forEach(c => {
    const gap = Number(c.target_yield) - Number(c.current_yield);
    const gapPct = gap / Number(c.target_yield) * 100;
    Logger.log(c.name_vi + ' · ' + c.current_yield + ' · ' + c.target_yield + ' · ' + c.vn_avg_yield + ' · ' + c.world_avg_yield + ' · ' + gapPct.toFixed(1) + '%');
  });

  Logger.log('');
  Logger.log('INVESTMENT PRIORITY (largest gaps):');
  summary.sort((a,b) => (100 - Number(a.yield_vs_target_pct)) - (100 - Number(b.yield_vs_target_pct))).slice(0, 3).forEach(c => {
    Logger.log('  ' + c.name_vi + ' · ' + (100 - Number(c.yield_vs_target_pct)).toFixed(1) + '% gap · Consider replanting/grafting programs');
  });
}

/**
 * Farmgate price spread - middlemen analysis
 */
function analyzeFarmgateSpread() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const income = readSheet(ss, 'fact_farmer_income');

  const byCommodity = {};
  income.forEach(r => {
    if (!byCommodity[r.commodity_id]) byCommodity[r.commodity_id] = [];
    byCommodity[r.commodity_id].push(Number(r.farmgate_pct));
  });

  Logger.log('=== FARMGATE PRICE ANALYSIS ===');
  Logger.log('Farmgate % = what farmer receives vs export price');
  Logger.log('Higher % = fewer middlemen = better farmer outcome');
  Logger.log('');
  Object.entries(byCommodity).forEach(([cid, vals]) => {
    const avg = vals.reduce((a,b) => a + b, 0) / vals.length;
    const flag = avg >= 70 ? '🟢' : avg >= 62 ? '🟡' : '🔴';
    Logger.log(flag + ' ' + cid + ' · Farmgate ' + avg.toFixed(1) + '%');
  });
  Logger.log('');
  Logger.log('Target: 70%+ (direct procurement, cooperatives, contract farming)');
}

function testReadData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['dim_commodities','dim_regions','dim_markets','fact_production','fact_exports','fact_farmer_income','summary_by_commodity','summary_by_region'].forEach(name => {
    try { Logger.log('✓ ' + name + ': ' + readSheet(ss, name).length + ' rows'); }
    catch (err) { Logger.log('✗ ' + name + ': ' + err.message); }
  });
}
