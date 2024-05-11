import { Document, Page, View, Text, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#FFFFFF'
  },
  imageContainer: {
    margin: 10,
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center', 
    width: '25%', 
    border: '1px',
    padding: '10px',
    borderRadius: '20px',
    overflow: 'hidden',
    gap: '5px',

  },
  image: {
    width: '100%',
    objectFit: 'cover'
  },
  tableNumber: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
    border: '1px',
    borderRadius: '50%',
    paddingHorizontal: '10px',
    paddingVertical: '2px',
    overflow: 'hidden',
    fontSize: '10px',
    textAlign: 'center',
  }
});

const CreatePDF = ({ qrCodes }: { qrCodes: string[] }) => (
  <PDFViewer style={{ width: '100%', height: '90vh' }}>
    <Document>
      <Page size="A4" style={styles.page}>
        {qrCodes.map((code, index) => (
          <View style={styles.imageContainer} key={`qr_${index}`}>
            <Image src={code} style={styles.image} />
            <Text style={styles.tableNumber}>Table: {index}</Text>
          </View>
        ))}
      </Page>
    </Document>
  </PDFViewer>
);

export default CreatePDF;