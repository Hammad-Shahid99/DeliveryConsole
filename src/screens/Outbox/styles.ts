import { StyleSheet } from 'react-native';
import dimensions from '../../utils/dimensions';

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: dimensions.height(4),
  },
  syncPromptCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: dimensions.width(0.2),
    borderColor: '#E5E7EB',
    borderRadius: dimensions.height(1.5),
    padding: dimensions.width(4),
    marginHorizontal: dimensions.width(4),
    marginVertical: dimensions.height(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  syncCardLeft: {
    flex: 1,
  },
  syncCardTitle: {
    fontSize: dimensions.height(2.1),
    fontWeight: '700',
    color: '#000000',
  },
  syncCardSubtitle: {
    fontSize: dimensions.height(1.8),
    color: '#6B7280',
    marginTop: dimensions.height(0.4),
  },
  syncIconContainer: {
    width: dimensions.width(13),
    height: dimensions.width(13),
    borderRadius: dimensions.height(1),
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: dimensions.width(4),
  },
});
