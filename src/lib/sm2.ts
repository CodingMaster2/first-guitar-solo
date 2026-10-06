export interface SM2Card {
  easeFactor: number  // starts at 2.5
  reviewCount: number // how many times reviewed
  nextReviewAt: Date  // when to review next
}

/**
 * SM-2 spaced repetition algorithm.
 * quality: 0-5  (0-1 = fail, 2 = hard, 3 = ok, 4 = good, 5 = perfect)
 */
export function calculateNextReview(card: SM2Card, quality: number): SM2Card {
  const now = new Date()

  if (quality < 3) {
    // Failed — review again in 1 day, keep existing ease factor
    const nextReviewAt = new Date(now)
    nextReviewAt.setDate(nextReviewAt.getDate() + 1)
    return {
      easeFactor: card.easeFactor,
      reviewCount: card.reviewCount, // don't advance count on failure
      nextReviewAt,
    }
  }

  // Calculate interval in days
  let interval: number
  if (card.reviewCount === 0) {
    interval = 1
  } else if (card.reviewCount === 1) {
    interval = 6
  } else {
    // Approximate: 6 * EF^(reviewCount - 1)
    // This reconstructs the geometric SM-2 progression without storing prevInterval
    interval = Math.round(6 * Math.pow(card.easeFactor, card.reviewCount - 1))
  }

  // Update ease factor: EF' = EF + 0.1 - (5-q)(0.08 + (5-q)*0.02), floor at 1.3
  const newEaseFactor = Math.max(
    1.3,
    card.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  const nextReviewAt = new Date(now)
  nextReviewAt.setDate(nextReviewAt.getDate() + interval)

  return {
    easeFactor: newEaseFactor,
    reviewCount: card.reviewCount + 1,
    nextReviewAt,
  }
}
