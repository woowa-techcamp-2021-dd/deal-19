import { categoryList } from '../configs/constants.js';

function parseCategoryType (categoryId) {
  const category = categoryList.find((category) => category.id === categoryId);

  return category.title;
}

export default parseCategoryType;
