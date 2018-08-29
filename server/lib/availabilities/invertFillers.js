
/**
 * isBeforeRange is a function used to determine if a date is before a
 * certain range
 *
 * @param date
 * @param range
 * @return {boolean}
 */
export function isBeforeRange(date, range) {
  return date < range.startDate;
}

/**
 * isDuringRange is a function used to determine if a date during a
 * certain range
 *
 * @param date
 * @param range
 * @returns boolean
 */
export function isDuringRange(date, range) {
  // <= operators will automatically cast date objects to
  // if using exact equals you need to cast to .getTime()
  return range.startDate <= date && date <= range.endDate;
}

/**
 * isAfterRange is a function used to determine if a date is after a
 * certain range
 *
 * @param date
 * @param range
 * @return {boolean}
 */
export function isAfterRange(date, range) {
  return range.endDate < date;
}

/**
 * invertTimeSlots is a function that will take an array of ranges (startDate -> endDate)
 * and produce an array of ranges inBetween the supplied ranges.
 *
 * NOTE: This function assumes the supplied ranges are in order of startDate ASC and endDate
 * is always after startDate
 *
 * NOTE: This function needs to have all dates to be the same type, can't supply a combo ISOStrings and
 * Date objects
 *
 * @param fillers - array of ranges that block/fill time
 * @param startDate
 * @param endDate
 * @returns [ranges] - array of ranges that are in between fillers
 */
export default function invertFillers(fillers, startDate, endDate) {
  const length = fillers.length;

  // Because our function depends on looping through fillers, if there's no fillers
  // do an early return
  if (!length) {
    return [{ startDate, endDate }];
  }

  let i;
  let post = startDate;
  const lastIndex = length - 1;
  const ranges = [];
  for (i = 0; i < length; i++) {
    // Important for rest of algorithm to assume the post is never after
    // the overall endDate
    const filler = fillers[i];
    if (endDate <= post && (filler.startDate <= startDate || filler.endDate >= endDate)) {
      break;
    }

    // Nested if statements are really for code clarity and performance optimization.
    if (isBeforeRange(post, filler)) {
      if (i === lastIndex) {
        if (isBeforeRange(endDate, filler)) {
          ranges.push({ startDate: post, endDate });
        } else if (isDuringRange(endDate, filler)) {
          ranges.push({ startDate: post, endDate: filler.startDate });
        } else {
          // Assume endDate is after the range if !before & !during
          ranges.push({ startDate: post, endDate: filler.startDate });
          ranges.push({ startDate: filler.endDate, endDate });
        }
      } else {
        ranges.push({ startDate: post, endDate: filler.startDate });
      }

      post = filler.endDate;
    } else if (isDuringRange(post, filler)) {
      if (i === lastIndex) {
        // endDate would never be before filler if post is during it
        if (isAfterRange(endDate, filler)) {
          ranges.push({ startDate: filler.endDate, endDate });
        }
      }

      post = filler.endDate;
    } else {
      // Assume its after the range if !before & !during
      // Happens when the next filler has an endDate before the other one
      // We order by startDate, doesn't mean endDates are always after...
      if (i === lastIndex) {
        ranges.push({ startDate: post, endDate });
      }
    }
  }

  return ranges;
}
