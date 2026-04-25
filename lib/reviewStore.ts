let reviews: any[] = [];

export async function getReviews() {
  return reviews;
}

export async function addReview(review: any) {
  reviews = [review, ...reviews];
}

export async function updateReview(id: string, data: any) {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;

  reviews[index] = { ...reviews[index], ...data };
  return reviews[index];
}

export async function deleteReview(id: string) {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;

  reviews[index] = {
    ...reviews[index],
    deleted: true,
    deletedAt: Date.now(),
  };

  return reviews[index];
}