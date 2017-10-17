import { Review, Event } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

export function fetchReviewEvents(patientId, accountId) {
  return Review.findAll({
    raw: true,
    where: {
      patientId,
    },

    order: [['createdAt', 'ASC']],
  }).then((reviews) => {
    return reviews.map((review) => {
      const buildData = {
        id: review.id,
        patientId,
        accountId,
        type: 'Review',
        metaData: {
          createdAt: review.createdAt,
          stars: review.stars,
          description: review.description,
        },
      };

      return Event.build(buildData).get({ plain: true });
    });
  });
}
