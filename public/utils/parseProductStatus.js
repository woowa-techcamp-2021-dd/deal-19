import {
  PRODUCT_STATUS_SOLD,
  PRODUCT_STATUS_ONSALE,
  PRODUCT_STATUS_RESERVED
} from '../configs/constants.js';

function parseProductStatus (statusCode) {
  let status = '';

  switch (statusCode) {
    case PRODUCT_STATUS_SOLD:
      status = '판매완료';
      break;
    case PRODUCT_STATUS_RESERVED:
      status = '예약중';
      break;
    case PRODUCT_STATUS_ONSALE:
      status = '판매중';
      break;
    default:
  }

  return status;
}

export default parseProductStatus;
