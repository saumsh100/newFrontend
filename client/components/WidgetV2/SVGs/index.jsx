
import React from 'react';

const closeBookingModalSVG = (
  <svg xmlns="http://www.w3.org/2000/svg">
    <path d="M6.44 7.146L.796 1.504A.51.51 0 0 1 .782.782a.51.51 0 0 1 .722.015L7.146 6.44 12.79.797a.51.51 0 0 1 .721-.015.51.51 0 0 1-.014.722L7.854 7.146l5.642 5.643a.51.51 0 0 1 .014.721.51.51 0 0 1-.721-.014L7.146 7.854l-5.642 5.642a.51.51 0 0 1-.722.014.51.51 0 0 1 .015-.721L6.44 7.146z" />
  </svg>
);

const backButtonSVG = (
  <svg xmlns="http://www.w3.org/2000/svg">
    <path d="M2.207 7.5l5.147 5.146a.5.5 0 1 1-.708.708l-6-6a.5.5 0 0 1 .01-.717l5.99-5.99a.5.5 0 0 1 .708.707L2.207 6.5H12a.5.5 0 1 1 0 1H2.207z" />
  </svg>
);

const bookingTabSVG = (
  <svg xmlns="http://www.w3.org/2000/svg">
    <path d="M0 2.5h2.5V0H0v2.5zM3.75 10h2.5V7.5h-2.5V10zM0 10h2.5V7.5H0V10zm0-3.75h2.5v-2.5H0v2.5zm3.75 0h2.5v-2.5h-2.5v2.5zM7.5 0v2.5H10V0H7.5zM3.75 2.5h2.5V0h-2.5v2.5zM7.5 6.25H10v-2.5H7.5v2.5zm0 3.75H10V7.5H7.5V10z" />
  </svg>
);

const summaryTabSVG = (
  <svg xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5A2.5 2.5 0 1 0 5.001.001 2.5 2.5 0 0 0 5 5zm0 1.25c-1.669 0-5 .838-5 2.5V10h10V8.75c0-1.662-3.331-2.5-5-2.5z" />
  </svg>
);

const bookingConfirmedSVG = (
  <svg width="145" height="104" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <g transform="translate(34 32)" stroke="var(--primaryColor)">
        <rect fill="#FFF" x=".5" y="7.5" width="74" height="64" rx="4" />
        <path d="M.5 24.5h74V11A3.5 3.5 0 0 0 71 7.5H4A3.5 3.5 0 0 0 .5 11v13.5z" fill="#FFF" />
        <g transform="translate(11)" fill="#FFF">
          <rect x=".5" y=".5" width="4.855" height="17" rx="2.428" />
          <rect x="48.645" y=".5" width="4.855" height="17" rx="2.428" />
        </g>
        <path strokeLinecap="round" strokeLinejoin="round" d="M25 46.803l9.839 10.24L55.059 36" />
      </g>
      <g opacity=".5" transform="translate(0 -4)">
        <circle stroke="var(--primaryColor)" cx="123" cy="18" r="3" />
        <circle stroke="var(--primaryColor)" cx="122.5" cy="62.5" r="2.5" />
        <circle fill="var(--primaryColor)" cx="103.5" cy="12.5" r="1.5" />
        <circle fill="var(--primaryColor)" cx="120" cy="36" r="2" />
        <circle fill="var(--primaryColor)" cx="57.5" cy="25.5" r="1.5" />
        <circle fill="var(--primaryColor)" cx="12.5" cy="66.5" r="1.5" />
        <circle fill="var(--primaryColor)" cx="1" cy="51" r="1" />
        <circle stroke="var(--primaryColor)" cx="21" cy="51" r="3" />
        <circle stroke="var(--primaryColor)" cx="34" cy="13" r="3" />
        <circle stroke="var(--primaryColor)" cx="85" cy="26" r="2" />
        <g stroke="var(--primaryColor)" strokeLinecap="round">
          <path d="M139.717 40.55l.507 8.68M144.282 44.833h-8.493" />
        </g>
        <g stroke="var(--primaryColor)" strokeLinecap="round">
          <path d="M73.717 4.55l.507 8.68M78.282 8.833h-8.493" />
        </g>
        <g stroke="var(--primaryColor)" strokeLinecap="round">
          <path d="M14.04 27.55l.506 8.68M18.604 31.833h-8.493" />
        </g>
      </g>
    </g>
  </svg>
);

const bookingPickDateSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14">
    <path d="M10.684 1.332h-.667V0H8.68v1.332H3.34V0H2.003v1.332h-.667c-.742 0-1.33.6-1.33 1.333L0 11.99c0 .733.594 1.332 1.336 1.332h9.348c.735 0 1.336-.6 1.336-1.332V2.665c0-.733-.601-1.333-1.336-1.333zm0 10.659H1.336V4.663h9.348v7.328z" />
  </svg>
);

const bookingReviewSVG = (
  <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z" />
  </svg>
);

const bookingWaitlistSelectTimesSVG = (
  <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z" />
  </svg>
);

export {
  backButtonSVG,
  bookingConfirmedSVG,
  bookingPickDateSVG,
  bookingReviewSVG,
  bookingTabSVG,
  bookingWaitlistSelectTimesSVG,
  closeBookingModalSVG,
  summaryTabSVG,
};
