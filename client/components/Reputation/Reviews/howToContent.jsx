
import React from 'react';
import styles from './howToStyles.scss';

export default {
  positive: {
    title: 'How to Respond to Positive Reviews',
    content: (
      <div>
        <div className={styles.paragraph}>
          Seventy-two percent of consumers say they trust online reviews as much
          as personal referrals, so whether it’s a testimonial, a detailed
          article on someone’s blog, or an offhand comment on Twitter, people
          are now chatting 24/7—and local business owners need to be paying
          attention. This is why responding to reviews is extremely important.
        </div>
        <div className={styles.paragraph}>
          When drafting review responses, we recommend that you personalize the
          response to the content of the original review. This lets them know
          that you have read their feedback, and that you aren’t just sending a
          stock response.
        </div>
        <div className={styles.paragraph}>
          <strong>For positive reviews</strong>, thank them for their praise,
          and invite them to come back. You can let them know about upcoming
          promotions that they might be interested in. Remember, positive
          reviews also make great social posts!
        </div>
      </div>
    ),
  },

  negative: {
    title: 'How to Respond to Negative Reviews',
    content: (
      <div>
        <div>
          <div className={styles.paragraph}>
            Seventy-two percent of consumers say they trust online reviews as
            much as personal referrals, so whether it’s a testimonial, a
            detailed article on someone’s blog, or an offhand comment on
            Twitter, people are now chatting 24/7—and local business owners need
            to be paying attention. This is why responding to reviews is
            extremely important.
          </div>
          <div className={styles.paragraph}>
            When drafting review responses, we recommend that you personalize
            the response to the content of the original review. This lets them
            know that you have read their feedback, and that you aren’t just
            sending a stock response.
          </div>
          <div className={styles.paragraph}>
            <strong>Negative reviews</strong> should also be personalized to the
            content of the review. You want them to know that you are listening
            to their complaints. Make sure to apologize for the experience, and
            invite the reviewer to resolve the issue offline. It’s always better
            to deal with their issues privately.
          </div>
        </div>
      </div>
    ),
  },
};
