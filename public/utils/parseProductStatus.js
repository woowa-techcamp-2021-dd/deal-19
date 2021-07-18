import { PRODUCT_STATUS } from '../configs/constants.js';

function parseProductStatus (statusCode) {
  let status = '';

  switch (statusCode) {
    case PRODUCT_STATUS.SOLD:
      status = '판매완료';
      break;
    case PRODUCT_STATUS.RESERVED:
      status = '예약중';
      break;
    case PRODUCT_STATUS.ONSALE:
      status = '판매중';
      break;
    default:
  }

  return status;
}

export default parseProductStatus;
