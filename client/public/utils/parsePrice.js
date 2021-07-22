function parsePrice (price) {
  if (typeof price !== 'number') {
    price = Number(price);
  }
  return price.toLocaleString();
}

export default parsePrice;
