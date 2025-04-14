/**
 * Formats a date string into short date format. Ex. Jan 1, 2025
 * @param {String} dateString
 * @returns string - containing the short date format
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default formatDate;