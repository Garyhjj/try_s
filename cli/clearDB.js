process.env.NODE_ENV = 'production';


const db = require('./oracleDB');

// db.search('select * from MHUB_COMPANY').then((data) => {
//     console.log(data);
// })
const deleteTables = ['MHUB_SYSTEM_ITEMS',
    'MHUB_VENDOR_MST',
    'MHUB_VENDOR_DTL',
    'MHUB_PO_MST',
    'MHUB_PO_DTL',
    'MHUB_PO_RESP_DTL',
    'MHUB_EDI_TABLE',
    'MHUB_ASN_MST_INTERFACE',
    'MHUB_ASN_DTL_INTERFACE',
    'MHUB_ASN_PALLET_INTERFACE',
    'MHUB_INV_DTL_INTERFACE',
    'MHUB_EDI_CONTROL_ERR',
    'MHUB_EDI_CONTROL_CURSOR',
    'MHUB_ASN_DTL_LOCAL',
    'MHUB_ASN_MST_LOCAL',
    'MHUB_WEB_SHIPMENT',
    'MHUB_WEB_PACKING',
    'MHUB_WEB_INVOICE',
    'MHUB_ASN_MST',
    'MHUB_ASN_MST_OUT',
    'MHUB_ASN_DTL_OUT',
    'MHUB_INV_DTL_OUT',
    'MHUB_ASN_DTL',
    'MHUB_ASN_PALLET',
    'MHUB_INV_MST',
    'MHUB_INV_DTL',
    'MHUB_DELIVERY_NOTICE',
    'MHUB_WEIGHT_QTY_RATE',
    'MHUB_EDI_ERMSG',
    'MHUB_SHIPPING_INSTRUCTION',
    'MHUB_URGENT_SHIPMENT',
    'MHUB_SO_MST',
    'MHUB_SO_DTL',
    'MHUB_LABEL',
    'MHUB_CONTROL_PARTS',
    'MHUB_COMBINE_SO_MST',
    'MHUB_COMBINE_SO_DTL',
    'MHUB_BL_MST',
    'MHUB_BL_DTL',
    'MHUB_AA_MST',
    'MHUB_SHORTAGE',
    'MHUB_PACK_INV_UOM',
    'MHUB_PACKLIST',
    'MHUB_INVOICE_LIST',
    'MHUB_CUSTOM_HEADERS',
    'MHUB_CUSTOM_LINES',
    'MHUB_ERROR_MSG',
    'MHUB_HOLD_COMPARE_MST',
    'MHUB_RTV_TRACKING_DATA',
    'MHUB_AA_MST',
    'MHUB_RMA_INTERFACE',
    'MHUB_MANUAL_CHANGE_ASN',
    'MHUB_ITEM_CROSS_REFERENCE',
    'MHUB_ASN_DTL_OUT_TEMP',
    'MHUB_BND_EBPT_INTERFACE',
    'MHUB_BUYER_INFO',
    'MHUB_CLOSE_ERROR_REMARK',
    'MHUB_COMBINE_SO_TEMP',
    'MHUB_COMFIRM',
    'MHUB_CUSTOM_LIST',
    'MHUB_DAILY_CONVERSION_RATES',
    'MHUB_ERP_CUSTOM_HEADERS',
    'MHUB_ERP_CUSTOM_LINES',
    'MHUB_HOLD_COMPARE_MST_BACK',
    'MHUB_HOLD_COMPARE_REPORT',
    'MHUB_IE_FORWARDERS',
    'MHUB_INVOICE_LIST_TEMP',
    'MHUB_KPI_URGENT',
    'MHUB_PERMIT_PARTNO',
    'MHUB_PK_DTL',
    'MHUB_PK_INV_DTL',
    'MHUB_PK_MST',
    'MHUB_RECEIVED_WH_DATE',
    'MHUB_UNBOUND_PART',
    'MHUB_URGENT_ITEMS'
]

// const deleteTables = ['MHUB_EDI_CONTROL_CURSOR'];


function begin(list) {
    if (Array.isArray(list)) {
        list.forEach((l) => db.execute(`delete from ${l}`).then(() => console.log(`${l} deleted`)).catch((err) => console.error(`${l}: ` + err.message)));
    }
}

begin(deleteTables);