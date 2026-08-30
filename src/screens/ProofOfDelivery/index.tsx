import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import Button from '../../components/Button';
import dimensions from '../../utils/dimensions';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useRouteStore } from '../../state/useRouteStore';
import templatesData from '../../data/pod-templates.json';
import styles from './styles';

export default function ProofOfDeliveryScreen({ route }: any) {
  const { stopNumber, name, address, parcelsCount, templateId } = route.params;
  const navigation = useNavigation();
  const { completeStop } = useRouteStore();

  const currentTemplate = templatesData.find(t => t.templateId === templateId) || templatesData[0];

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    currentTemplate.fields.forEach(field => {
      if (field.type === 'DATETIME') {
        const now = new Date();
        const dateStr = now.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        initialValues[field.id] = `${dateStr} ${timeStr}`;
      }
    });
    setFormValues(prev => ({ ...prev, ...initialValues }));
  }, [currentTemplate]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const isFieldVisible = (field: any) => {
    if (!field.visibleWhen) return true;
    const { fieldId, equals } = field.visibleWhen;
    const dependencyValue = formValues[fieldId];
    return dependencyValue === equals;
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    const responses: Array<{ fieldId: string; value: any }> = [];

    currentTemplate.fields.forEach((field) => {
      if (!isFieldVisible(field)) return;
      if (!['TEXT', 'TEXTAREA', 'DROPDOWN', 'CHECKBOX', 'DATETIME'].includes(field.type)) {
        return;
      }

      const val = formValues[field.id];

      if (field.isRequired) {
        const isEmpty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          newErrors[field.id] = 'This field is required';
        }
      }

      if (val !== undefined && val !== null) {
        responses.push({ fieldId: field.id, value: val });
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Form Incomplete', 'Please fill in all required fields marked with *');
      return;
    }

    await completeStop(responses);
    navigation.goBack();
  };

  const renderField = (field: any) => {
    if (!isFieldVisible(field)) return null;

    const hasError = !!errors[field.id];

    switch (field.type) {
      case 'TEXT':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
            </Text>
            <TextInput
              style={[styles.textInput, hasError && styles.inputError]}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              placeholderTextColor="#9CA3AF"
              value={formValues[field.id] || ''}
              onChangeText={(text) => {
                handleFieldChange(field.id, text);
                setErrors(prev => ({ ...prev, [field.id]: '' }));
              }}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'TEXTAREA':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
            </Text>
            <TextInput
              style={[styles.textareaInput, hasError && styles.inputError]}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={4}
              value={formValues[field.id] || ''}
              onChangeText={(text) => {
                handleFieldChange(field.id, text);
                setErrors(prev => ({ ...prev, [field.id]: '' }));
              }}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'DROPDOWN':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
            </Text>
            <View style={styles.dropdownOptionsContainer}>
              {field.options?.map((option: string) => {
                const isSelected = formValues[field.id] === option;
                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleFieldChange(field.id, option);
                      setErrors(prev => ({ ...prev, [field.id]: '' }));
                    }}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected
                    ]}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'CHECKBOX':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
            </Text>
            <View style={styles.checkboxesList}>
              {field.options?.map((option: string) => {
                const currentSelections = (formValues[field.id] as string[]) || [];
                const isChecked = currentSelections.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.7}
                    style={styles.checkboxRow}
                    onPress={() => {
                      const nextSelections = isChecked
                        ? currentSelections.filter(o => o !== option)
                        : [...currentSelections, option];
                      handleFieldChange(field.id, nextSelections);
                      setErrors(prev => ({ ...prev, [field.id]: '' }));
                    }}
                  >
                    <Ionicons
                      name={isChecked ? "checkbox" : "square-outline"}
                      size={dimensions.height(2.6)}
                      color={isChecked ? "#1E60D5" : "#9CA3AF"}
                    />
                    <Text style={styles.checkboxLabel}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'DATETIME':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
            </Text>
            <View style={styles.dateTimeField}>
              <Ionicons
                name="calendar-outline"
                size={dimensions.height(2.2)}
                color="#4B5563"
                style={styles.dateTimeIcon}
              />
              <Text style={styles.dateTimeText}>
                {formValues[field.id] || 'Select Date/Time'}
              </Text>
            </View>
          </View>
        );

      default:
        return (
          <View key={field.id} style={styles.unsupportedCard}>
            <Ionicons name="alert-circle-outline" size={24} color="#D97706" />
            <Text style={styles.unsupportedText}>
              Unsupported field type: "{field.type}". Skipped in validation.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          title="Proof of Delivery"
          iconName="cloud-offline-outline"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContainer}>
            <View style={styles.badgeCircle}>
              <Text style={styles.badgeText}>{stopNumber}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.nameText}>{name}</Text>
              <Text style={styles.addressText}>{address}</Text>
              <View style={styles.infoRow}>
                <Ionicons
                  name="cube-outline"
                  size={dimensions.height(2.2)}
                  color="#4B5563"
                />
                <Text style={styles.infoText}>
                  {parcelsCount} {parcelsCount === 1 ? 'Parcel' : 'Parcels'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            {currentTemplate.fields.map((field) => renderField(field))}
          </View>

          <Button
            title="SAVE DELIVERY"
            onPress={handleSubmit}
            style={styles.saveButton}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
