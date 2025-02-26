const productController = require('../controllers/productController');
const Product = require('../model/Product');

// Mock Sequelize Methods
jest.mock('../model/Product', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Product Controller', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should create a new product', async () => {
    const req = { body: { productName: 'Test Product', price: 99.99, description: 'Test Desc' } };
    const res = mockResponse();
    Product.create.mockResolvedValue(req.body);

    await productController.createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
  });

  it('should return all products', async () => {
    const req = {};
    const res = mockResponse();
    Product.findAll.mockResolvedValue([{ id: 1, productName: 'Test Product' }]);

    await productController.getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([{ id: 1, productName: 'Test Product' }]));
  });

  it('should return a product by ID', async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();
    Product.findByPk.mockResolvedValue({ id: 1, productName: 'Test Product' });

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it('should return 404 if product not found', async () => {
    const req = { params: { id: 2 } };
    const res = mockResponse();
    Product.findByPk.mockResolvedValue(null);

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });
});
