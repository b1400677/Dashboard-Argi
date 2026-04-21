# 🌾 DDA Agro Group · Agricultural Export Analytics Dashboard

Dashboard phân tích đa hàng hóa nông sản xuất khẩu cho công ty **giả lập** "Tập đoàn Nông Sản Đông Dương (DDA Agro Group)" — 7 commodities × 20 vùng × 8 thị trường xuất khẩu.

> ⚠️ **Dữ liệu giả lập**. Benchmarks theo số liệu thực tế VN agri 2024-2025 (USDA FAS, VICOFA, Mordor Intelligence, Coffee Geography).
>
> Business model inspired by Intimex Group + Vinh Hoan + Loc Troi conglomerate pattern

---

## 📦 Files

| File | Vai trò |
|------|---------|
| `dashboard_agri.html` | Dashboard: Export Value hero + 6 KPIs + 6 charts + Portfolio Matrix + Harvest Calendar |
| `google_apps_script_agri.gs` | API đọc Google Sheets + EUDR audit + Yield gap + Farmgate spread |
| `agri_data.xlsx` | 8 sheets |
| `README_AGRI.md` | File này |

---

## 🏢 DDA Agro Group (Giả lập)

| Thông tin | Giá trị |
|-----------|---------|
| Loại hình | Multi-commodity Agricultural Export |
| **Commodities** | **7** (Coffee/Rice/Pepper/Cashew/Dragon Fruit/Pangasius/Rubber) |
| **Regions** | **20** vùng nguyên liệu VN |
| **Hectares** | **126,640 ha** |
| **Farmers** | **37,440 hộ** (~3.4 ha/hộ · smallholder) |
| **Markets** | **8** thị trường xuất khẩu |
| Period | 2023-04 → 2025-03 (24 tháng) |

### 🌾 7 Commodities

| Commodity | VN Name | Category | Avg Yield | Target | Price |
|-----------|---------|----------|-----------|--------|-------|
| **Robusta Coffee** | Cà phê Robusta | Industrial | 3.0 t/ha | 3.5 | $4,800/t |
| **Rice Jasmine** | Lúa gạo Jasmine | Staple | 6.2 t/ha | 7.0 | $625/t |
| **Black Pepper** | Hồ tiêu | Spice | 2.8 t/ha | 3.5 | $6,200/t |
| **Cashew** | Điều | Nut | 1.2 t/ha | 1.8 | $7,500/t |
| **Dragon Fruit** | Thanh long | Fruit | 28 t/ha | 35 | $1,800/t |
| **Pangasius** | Cá tra | Aquaculture | 30 t/ha/yr | 40 | $2,850/t |
| **Natural Rubber** | Cao su tự nhiên | Industrial | 1.7 t/ha | 2.0 | $1,950/t |

### 📈 Financial KPIs (Annualized)

| KPI | Value | Benchmark | Status |
|-----|-------|-----------|--------|
| **Export Value** | **$1.42B USD/năm** | Top VN agri $0.5-1.5B | 🟢 Top-tier |
| **Production (24m)** | 1,603k tons | — | — |
| **Export Volume (24m)** | 1,244k tons | — | — |
| **Avg Price** | $2,283/ton | — | — |
| **YoY Export Growth** | **+45.3%** | VN coffee +40-60% | 🟢 Strong |
| **Certified %** | **69.5%** | VN avg 25-30% specialty | 🟢 Above avg |
| **EUDR Ready %** | **57.7%** | Target 80%+ by 2026 | 🟡 On track |
| **Post-Harvest Loss** | **10.5%** | World avg 15-20% | 🟢 Below avg |
| **EU Share** | **30.1%** | Coffee EU 41% avg | 🟡 Critical for EUDR |
| **Farmer Income** | **28M VND/Q** (~112M/năm) | VN rural 80-200M/năm | 🟢 In range |
| **Farmgate %** | **65.7%** | Target 70%+ | 🟡 Middlemen exist |

---

## 🎯 KPIs đặc trưng Agriculture

### 1. **Export Value (USD)** — hero KPI
Toàn ngành VN agri export $54B+/năm. Top exporters: coffee ($5B+), rice ($5B+), fruits ($5B+), seafood ($9B+).

### 2. **Yield per Hectare**
Benchmark theo USDA FAS / Mordor Intelligence:
- VN rice 6.2 t/ha vs world 4.7
- VN coffee 3.0 t/ha vs world 1.0 (3× world avg!)
- VN pepper 2.8 t/ha vs world 1.2
- VN pangasius ~30 t/ha/yr (unique advantage)

### 3. **Certification %** — VietGAP / GlobalGAP / Organic / RA / 4C
VN target: 30% specialty coffee by 2030. Premium markets demand certification.

### 4. **EUDR Readiness** (CRITICAL for 2026)
EU Deforestation Regulation effective 2026 — 41% of VN coffee exports to EU. No traceability = no access.

### 5. **Post-Harvest Loss %**
VN target <10% (world avg 15-20%). Key lever for farmer income.

### 6. **Farmgate %** (farmer share of export price)
Target 70%+ through cooperatives + contract farming + direct procurement.

### 7. **Farmer Household Income**
Smallholder model dominant (3-5 ha/hộ). Target: 80-200M VND/năm.

### 8. **YoY Export Growth**
2024/25 crop year saw record for Vietnam coffee ($5B+ breakthrough).

---

## 🗄️ Schema (8 sheets)

```
dim_commodities (7)
  - yield targets, prices, harvest cycles
dim_regions (20)
  - Đắk Lắk, Lâm Đồng, An Giang, Kiên Giang, Bình Phước, Bình Thuận...
  - cert_level (veryhigh/high/medium/low)
dim_markets (8)
  - EU, US, China, Japan, Korea, ASEAN, Middle East, Others
  - standard_level (strict vs standard)
                 ↓
fact_production (480 records = 20 regions × 24 months)
  - production_tons, yield_per_ha
  - organic/globalgap/vietgap/conventional %
  - post_harvest_loss_pct, eudr_ready_pct
                 ↓
fact_exports (1,344 records = commodity × market × month)
  - volume_tons, price_usd_per_ton, value_usd
                 ↓
fact_farmer_income (160 records = 20 regions × 8 quarters)
  - revenue_per_ha, cost_per_ha, net_per_ha, net_per_farmer
  - farmgate_pct (farmer share of export price)
                 ↓
summary_by_commodity (7) · summary_by_region (20) — pre-aggregated
```

---

## 🚀 Cách dùng

**Option 1**: Mở `dashboard_agri.html` trực tiếp.

**Option 2 (Google Sheets sync)**:
1. Upload `agri_data.xlsx` → Google Sheets
2. Apps Script → paste `google_apps_script_agri.gs`
3. Deploy Web App → dán URL vào dashboard

---

## 📊 Dashboard Features

### 🎯 Export Value Hero (56px font)
- **$1.42B USD/năm** annualized
- **+45.3% YoY growth** badge
- Volume + Avg Price decomposition

### 6 Mini KPIs
Hectares · Farmers · Certified % · EUDR Ready % · Farmer Income · Post-Harvest Loss

### 6 Charts + 2 Signature Visuals

1. **Export Value Trend** (bar + line) — Monthly value + avg price overlay
2. **Export Destinations** (doughnut) — 8 markets with EU/US/China dominance
3. **⭐ SIGNATURE: Commodity Portfolio Matrix** (bubble)
   - **X-axis**: Yield vs Target %
   - **Y-axis**: YoY Growth %
   - **Bubble size**: Export Value USD
   - **Color**: Each commodity unique
   - → Identifies: stars (high yield + growth), dogs (low both), emerging (low yield + high growth)
4. **Certification Breakdown per Commodity** (stacked bars)
   - Organic (dark green) + GlobalGAP (sage) + VietGAP (gold) + Conventional (faded)
5. **🌾 SIGNATURE: Harvest & Export Seasonality Calendar** (heatmap)
   - 12 months × 7 commodities
   - Darker = higher volume
   - Reveals: coffee peaks Oct-Feb, rice Mar-Aug, pepper Feb-May, dragon fruit May-Oct
6. **Yield vs Target** (horizontal bar, 3 series) — Current/Target/World Avg
7. **Farmer Income Trend** (multi-line) — 8 quarters × 7 commodities in USD/ha

### 📋 Commodity Portfolio Scorecard (7 rows)
Category · Hectares · Farmers · Export USD · Price · Yield · vs Target · YoY · Cert · EUDR

### 📋 Regions Performance (20 rows)
Commodity · Hectares · Farmers · Cert Level · Yield · Cert% · EUDR% · Loss% · Income

---

## 🌟 Apps Script Signature Functions

### `auditEUDRGap()` — EUDR 2026 Compliance
**Most critical function** — EU Deforestation Regulation takes effect 2026:
- Flag commodities with EUDR <80%
- Specific regions at risk
- 5-step action plan:
  1. GPS plot mapping (136,000 ha MAE coverage)
  2. Simexco Daklak / EDE traceability model
  3. SGS/Bureau Veritas/Control Union verification
  4. Cross-reference MAE monitoring
  5. Due diligence statements per Article 10

### `analyzeYieldGap()` — Productivity Investment Priority
Shows gap between current vs target yields, identifies top 3 commodities for replanting/grafting programs.

### `analyzeFarmgateSpread()` — Middlemen Analysis
- Target: 70%+ farmgate
- 🟢 / 🟡 / 🔴 indicators per commodity
- Recommends: direct procurement, cooperatives, contract farming

---

## 🎯 Use cases thực tế

### 1. Monthly S&OP Meeting
- Export Value Trend → pipeline health
- Harvest Calendar → production forecast
- Market mix → destination diversification

### 2. Quarterly Board / Investor Update
- Annualized Export Value ($1.42B)
- YoY Growth (+45.3%)
- Portfolio Matrix → strategic positioning
- Certified % progress

### 3. EUDR Compliance (URGENT 2026)
- Run `auditEUDRGap()` monthly
- Track EUDR Ready % per region
- Prioritize Central Highlands coffee (41% exports to EU)

### 4. Sustainability & ESG Reporting
- Certified production %
- Farmer income tracking
- Post-harvest loss reduction

### 5. Sourcing Strategy
- Commodity Portfolio Matrix → invest where?
- Regional cert level distribution
- Yield gap analysis → replanting priorities

### 6. Farmer Programs
- Income trend per commodity
- Farmgate spread → middleman elimination
- Target training programs

---

## 📈 VN Agriculture Context (2024-2025)

### Market Facts
- **VN total agri exports**: ~$54B/năm (top 15 globally)
- **Coffee**: Vietnam là 2nd largest exporter (after Brazil), 20% global supply
- **Coffee 2024-25**: $5B+ breakthrough milestone
- **Rice yield 6.2 t/ha** (2024/2025) — improved from 5.7 (2015)
- **Coffee yield 3 t/ha** — 3× world average
- **Coffee cultivation area**: 716,600-730,000 ha
- **Certified internationally**: 300k ha (UTZ, RA, 4C, GlobalGAP, VietGAP, Organic)
- **Specialty coffee target**: 19,000 ha by 2030, 11,000 tons premium output

### Geography (Central Highlands dominance)
- **Đắk Lắk**: Largest coffee producer
- **Lâm Đồng**: Leads sustainability (86,000+ ha certified)
- **Đắk Nông, Gia Lai, Kon Tum**: Make up remaining 90% coffee
- **Mekong Delta**: Rice (An Giang, Kiên Giang, Đồng Tháp, Long An)
- **Bình Phước**: Cashew + Rubber + Pepper
- **Bình Thuận**: Dragon Fruit

### 2026 Challenges
- **EUDR (EU Deforestation Regulation)** effective 2026
- 41% of coffee exports to EU → compliance CRITICAL
- MAE developing monitoring for 136,000 ha
- Simexco Daklak + EDE Company pioneer traceability

### Government Programs
- Coffee Replanting 2021-2025: 107,000 ha target
- Productivity goal: 3.5 t/ha
- Income boost: 1.5-2× targeted
- Specialty coffee conversion: 19,000 ha (3% of total)

---

## 🔑 Actionable Insights

1. 🟢 **Export $1.42B/năm (+45.3% YoY)** — Strong momentum, diversification working
2. 🟢 **Certified 69.5%** — Well above VN avg 25-30%, premium positioning solid
3. 🟡 **EUDR 57.7%** — CRITICAL gap, need push to 80%+ by 2026
4. 🟢 **Post-harvest loss 10.5%** — Below world avg 15-20%, good cold chain
5. 🟡 **Farmgate 65.7%** — Middlemen still significant, cooperative expansion needed
6. 🟢 **Robusta Coffee** ($589M/yr) flagship — 100% of target yield, 66% cert
7. 🟡 **Cashew yield 70% of target** — Largest gap, replanting priority
8. 🟢 **EU share 30.1%** — Diversified, but EUDR compliance urgency
9. 🟡 **Rubber** ($41M/yr) — Smallest contributor, evaluate strategic fit
10. 🟢 **Farmer income 112M VND/năm** — In healthy range, sustainable smallholder model

---

## ⚠️ Limitations & Assumptions

- **Data simulated** based on public benchmarks (USDA FAS, VICOFA, Mordor Intelligence)
- **Farmgate %**: Simplified — real world has varying middleman layers per commodity
- **EUDR Ready %**: Proxy based on cert level — real compliance requires plot-level GPS
- **Yield**: Annual avg used; real cycles vary (coffee 12 months, pangasius 6 months, rice 4 months)
- **Missing**: Climate risk (drought, flood, saltwater intrusion), pest outbreaks, currency hedging
- **Missing**: Logistics cost (cold chain, containers), quality rejections at destination

---

**Tóm lại**: Dashboard Agriculture đầy đủ với **Export Value** làm hero KPI ($1.42B/năm annualized, +45.3% YoY), **2 signature visuals**: (1) **Commodity Portfolio Matrix** (bubble chart: yield% × growth% × value size) cho chiến lược portfolio, (2) **Harvest & Export Seasonality Calendar** (heatmap 12 months × 7 commodities) cho planning cycle. Multi-commodity model (Coffee/Rice/Pepper/Cashew/Dragon Fruit/Pangasius/Rubber) × 20 vùng nguyên liệu × 8 thị trường XK. Apps Script có **`auditEUDRGap()`** cho EUDR 2026 compliance (CRITICAL vì EU chiếm 30% exports), `analyzeYieldGap()` cho productivity priority, `analyzeFarmgateSpread()` cho farmer income. Benchmarks theo USDA FAS + VICOFA (coffee 3 t/ha = 3× world avg, rice 6.2 t/ha), EUDR 2026 regulation requirements, VN agri conglomerate scale ($1-1.5B/yr export comparable to Intimex). Schema áp dụng được cho bất kỳ agri-exporter VN nào (coffee/rice/seafood/fruit exporter).
