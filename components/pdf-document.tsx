import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    fontSize: 9,
    color: '#334155',
  },
  body: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 10,
    color: '#1e293b',
    marginBottom: 10,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 8,
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
  },
});

interface GrievancePDFDocumentProps {
  letterText: string;
  departmentName: string;
}

export const GrievancePDFDocument: React.FC<GrievancePDFDocumentProps> = ({
  letterText,
  departmentName,
}) => {
  const paragraphs = letterText.split('\n').filter((p) => p.trim() !== '');

  return (
    <Document title={`Grievance_Representation_${departmentName}`}>
      <Page size="A4" style={styles.page}>
        {/* Official Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PUBLIC GRIEVANCE REPRESENTATION NOTICE</Text>
          <Text style={styles.headerSubtitle}>
            Government of National Capital Territory of Delhi (GNCTD) Formal Grievance Format
          </Text>
        </View>

        {/* Document Body */}
        <View style={styles.body}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Footer (Without Stamp) */}
        <View style={styles.footer}>
          <Text>
            Delhi NCR Citizen Grievance Assistance Portal — Independent Citizen Utility Notice
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default GrievancePDFDocument;
