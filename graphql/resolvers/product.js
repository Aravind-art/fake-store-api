const { GraphQLError } = require("graphql");
const {
  findProducts,
  findOneProduct,
  findCategories,
  findProductCount,
  createNewProduct,
  editProductById,
} = require("../../service/product");

const throwProductNotFound = (err) => {
  throw new GraphQLError("Product Not Found", {
    extensions: { code: "ITEM_NOT_FOUND" },
  });
};
const products = async (_, args) => {
  const { limit, offset, sort, category } = args;
  let queries = {};
  if (category) queries.category = category;
  return await findProducts({ limit, offset, sort, ...queries }).catch((err) =>
    console.log(err)
  );
};
const product = async (_, args) => {
  const data = await findOneProduct({ id: args.id }).catch((err) => {
    console.log(err);
    throwProductNotFound();
  });
  return data;
};
const categories = async (_, args) => {
  const categoriesData = await findCategories();
  return categoriesData;
};
const addProduct = async (_, args) => {
  const count = await findProductCount();
  const product = {
    id: count + 1,
    title: args.title,
    price: args.price,
    description: args.description,
    image: args.image,
    category: args.category,
  };
  return await createNewProduct(product);
};
const updateProduct = async (_, args) => {
  const updatedProduct = {};
  const nonRequiredFields = {
    title: args.title,
    price: args.price,
    category: args.category,
    description: args.description,
    image: args.image,
  };
  Object.entries(nonRequiredFields).forEach(([key, value]) => {
    if (key != null) updatedProduct[key] = value;
  });
  const updated = await editProductById(args.id, updated).catch(() => {
    throwProductNotFound();
  });

  return updated;
};
module.exports.productQueries = {
  products,
  product,
  categories,
};
module.exports.productMutations = {
  addProduct,
  updateProduct,
};
