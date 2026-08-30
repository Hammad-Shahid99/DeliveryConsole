import { Dimensions } from 'react-native';

const handleSize = (num: number) => {
  if (num <= 0) return 0;
  if (num > 100) return 100;
  return num;
};
const width = (number: number) => {
  let fullWidth = Dimensions.get('window').width;
  number = handleSize(number);
  if (number === 0) return 0;
  return fullWidth * (number / 100);
};
const height = (number: number) => {
  let fullHeight = Dimensions.get('window').height;
  number = handleSize(number);
  if (number === 0) return 0;
  else return fullHeight * (number / 100);
};
const totalSize = (number: number) => {
  let fullHeight = Dimensions.get('window').height;
  let fullWidth = Dimensions.get('window').width;
  return (
    Math.sqrt(fullHeight * fullHeight + fullWidth * fullHeight) *
    handleSize(number)
  );
};
export default { height, width, totalSize };
