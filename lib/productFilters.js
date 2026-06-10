export function buildProductSearchQuery(search) {
  const term = search?.trim();
  if (!term) return null;

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  return {
    $or: [
      { name: regex },
      { shortDescription: regex },
      { fullDescription: regex },
      { tags: regex },
      { shopCollection: regex },
      { category: regex },
      { material: regex },
    ],
  };
}

export function applyProductSort(products, sort) {
  const list = [...products];

  if (sort === "sale") {
    return list
      .filter((p) => p.comparePrice > p.price && p.comparePrice > 0)
      .sort((a, b) => {
        const discA = (a.comparePrice - a.price) / a.comparePrice;
        const discB = (b.comparePrice - b.price) / b.comparePrice;
        return discB - discA;
      });
  }

  if (sort === "price-low") {
    return list.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    return list.sort((a, b) => b.price - a.price);
  }

  if (sort === "bestseller") {
    return list.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
  }

  if (sort === "rating") {
    return list.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  }

  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function filterByMinRating(products, minRating) {
  if (!minRating || minRating <= 0) return products;
  return products.filter((p) => (p.avgRating || 0) >= minRating);
}
