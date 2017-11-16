import { Review, Event } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

export function fetchReviewEvents(patientId, accountId, query) {
  return Review.findAll({
    raw: true,
    where: {
      patientId,
    },
    ...query,
    order: [['createdAt', 'DESC']],
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

      const ev = Event.build(buildData);
      return ev.get({ plain: true });
    });
  });
}
