
import * as Titles from '../constants/PageTitle';

const mappings = [
  { title: Titles.CHAT_PAGE, regex: /\/chat\/(.+)\w+/g },
  { title: Titles.MESSAGES_PAGE, regex: /\/chat/g },
  { title: Titles.PATIENT_SEARCH_PAGE, regex: /\/patients\/search/g },
  { title: Titles.ONLINE_REQUESTS, regex: /\/requests/g },
  { title: Titles.SHORTCUTS_PAGE, regex: /\/shortcuts/g },
];

export default function (location) {
  for (const mapping in mappings) {
    const page = mappings[mapping];

    if (location.match(page.regex)) {
      return page.title;
    }
  }
  return false;
}
