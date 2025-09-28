import React, { useEffect, useState } from "react";
import productService, {
  type Product,
  ProductStatus,
} from "../../services/productService";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>({
    product_name: "",
    product_detail: "",
    product_price: 0,
    product_image: "",
    product_status: ProductStatus.IN_STOCK,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAllProducts();
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditProduct(null);
    setForm({
      product_name: "",
      product_detail: "",
      product_price: 0,
      product_image: "",
      product_status: ProductStatus.IN_STOCK,
    });
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      product_name: product.product_name,
      product_detail: product.product_detail,
      product_price: product.product_price,
      product_image: product.product_image || "",
      product_status: product.product_status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("คุณแน่ใจว่าต้องการลบสินค้านี้?")) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editProduct?.id) {
        await productService.updateProduct(editProduct.id, form);
      } else {
        await productService.addProduct(form);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">จัดการสินค้า</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
        >
          เพิ่มสินค้า
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
            >
              <div className="relative w-full h-40 mb-4">
                {p.product_image ? (
                  <img
                    src={p.product_image}
                    alt={p.product_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                    ไม่มีรูปภาพ
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {p.product_name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{p.product_detail}</p>
              <p className="text-gray-800 font-bold mb-2">
                ฿{p.product_price.toLocaleString()}
              </p>
              <p
                className={`text-sm font-medium mb-4 ${
                  p.product_status === ProductStatus.IN_STOCK
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {p.product_status === ProductStatus.IN_STOCK
                  ? "มีสินค้า"
                  : "สินค้าหมด"}
              </p>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 rounded-lg transition"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 rounded-lg transition"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">
              {editProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="ชื่อสินค้า"
                value={form.product_name}
                onChange={(e) =>
                  setForm({ ...form, product_name: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <textarea
                placeholder="รายละเอียด"
                value={form.product_detail}
                onChange={(e) =>
                  setForm({ ...form, product_detail: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="ราคา"
                value={form.product_price}
                onChange={(e) =>
                  setForm({ ...form, product_price: Number(e.target.value) })
                }
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                value={form.product_status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    product_status: e.target.value as ProductStatus,
                  })
                }
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={ProductStatus.IN_STOCK}>มีสินค้า</option>
                <option value={ProductStatus.OUT_STOCK}>สินค้าหมด</option>
              </select>
              <input
                type="text"
                placeholder="URL รูปภาพ"
                value={form.product_image}
                onChange={(e) =>
                  setForm({ ...form, product_image: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                  onClick={() => setModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
