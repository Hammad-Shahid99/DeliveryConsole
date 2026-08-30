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
    paddingBottom: dimensions.height(18),
  },
  sectionHeader: {
    fontSize: dimensions.height(2.2),
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: dimensions.width(4),
    marginTop: dimensions.height(2.5),
    marginBottom: dimensions.height(0.8),
  },
  departureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: dimensions.height(1),
    padding: dimensions.width(4),
    marginHorizontal: dimensions.width(4),
    marginVertical: dimensions.height(1),
  },
  departureTextContainer: {
    marginLeft: dimensions.width(3),
    flex: 1,
  },
  departureTitle: {
    fontSize: dimensions.height(2.0),
    fontWeight: '700',
    color: '#DC2626',
  },
  departureSubtitle: {
    fontSize: dimensions.height(1.8),
    color: '#B91C1C',
    marginTop: dimensions.height(0.2),
  },
  activeStopsText: {
    fontSize: dimensions.height(2.2),
    fontWeight: '600',
    color: '#1E60D5',
    marginHorizontal: dimensions.width(4),
    marginTop: dimensions.height(2),
    marginBottom: dimensions.height(0.5),
  },
  upcomingStopsText: {
    fontSize: dimensions.height(2.2),
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: dimensions.width(4),
    marginTop: dimensions.height(3),
    marginBottom: dimensions.height(0.5),
  },
  devPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FEF3C7',
    borderTopWidth: 1,
    borderColor: '#F59E0B',
    padding: dimensions.width(3),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  devHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devHeaderTitle: {
    fontSize: dimensions.height(1.9),
    fontWeight: '700',
    color: '#D97706',
  },
  devContent: {
    marginTop: dimensions.height(1.5),
  },
  devText: {
    fontSize: dimensions.height(1.7),
    color: '#B45309',
    fontWeight: '600',
  },
  devButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dimensions.height(1.2),
  },
  devButton: {
    width: '48%',
    backgroundColor: '#1E60D5',
    paddingVertical: dimensions.height(1.2),
    borderRadius: dimensions.height(0.8),
    alignItems: 'center',
  },
  devButtonOutside: {
    backgroundColor: '#DC2626',
  },
  devButtonNetwork: {
    marginTop: dimensions.height(1.2),
    paddingVertical: dimensions.height(1.2),
    borderRadius: dimensions.height(0.8),
    alignItems: 'center',
  },
  devButtonOnline: {
    backgroundColor: '#10B981',
  },
  devButtonOffline: {
    backgroundColor: '#4B5563',
  },
  devButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: dimensions.height(1.8),
  },
});
