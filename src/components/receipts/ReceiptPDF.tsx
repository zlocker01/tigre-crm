import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#6d28d9', // Purple-700
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: 80,
    height: 80,
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6d28d9', // Purple-700
    textAlign: 'right',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280', // Gray-500
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937', // Gray-800
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Gray-200
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 120,
    fontSize: 10,
    color: '#6b7280', // Gray-500
    fontWeight: 'medium',
  },
  value: {
    fontSize: 10,
    color: '#1f2937', // Gray-800
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#6d28d9', // Purple-700
    paddingBottom: 8,
    marginBottom: 8,
    marginTop: 10,
  },
  tableCell: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#1f2937',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6', // Gray-100
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#6d28d9', // Purple-700
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 11,
    color: '#6b7280',
    width: 120,
    textAlign: 'right',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 11,
    color: '#1f2937',
    width: 100,
    textAlign: 'right',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6d28d9', // Purple-700
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // Gray-200
    textAlign: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280', // Gray-500
    marginBottom: 3,
  },
  watermark: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    fontSize: 8,
    color: '#e5e7eb', // Gray-200
  },
});

interface ReceiptData {
  receiptNumber: string;
  date: string;
  emitter: {
    name: string;
    rfc?: string;
    address: string;
    phone?: string;
    email?: string;
  };
  client: {
    name: string;
    rfc?: string;
    address?: string;
    email?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  iva?: number;
  total: number;
  paymentMethod: string;
}

export function ReceiptPDF({ data }: { data: ReceiptData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con Logo y Título */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/app/logo.png" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>RECIBO DE PAGO</Text>
            <Text style={styles.subtitle}>Folio: {data.receiptNumber}</Text>
          </View>
        </View>

        {/* Datos del Emisor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Emisor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{data.emitter.name}</Text>
          </View>
          {data.emitter.rfc && (
            <View style={styles.row}>
              <Text style={styles.label}>RFC:</Text>
              <Text style={styles.value}>{data.emitter.rfc}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Domicilio:</Text>
            <Text style={styles.value}>{data.emitter.address}</Text>
          </View>
          {data.emitter.phone && (
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{data.emitter.phone}</Text>
            </View>
          )}
          {data.emitter.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{data.emitter.email}</Text>
            </View>
          )}
        </View>

        {/* Datos del Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{data.client.name}</Text>
          </View>
          {data.client.rfc && (
            <View style={styles.row}>
              <Text style={styles.label}>RFC:</Text>
              <Text style={styles.value}>{data.client.rfc}</Text>
            </View>
          )}
          {data.client.address && (
            <View style={styles.row}>
              <Text style={styles.label}>Domicilio:</Text>
              <Text style={styles.value}>{data.client.address}</Text>
            </View>
          )}
          {data.client.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{data.client.email}</Text>
            </View>
          )}
        </View>

        {/* Fecha y Forma de Pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Pago</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Emisión:</Text>
            <Text style={styles.value}>{data.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Forma de Pago:</Text>
            <Text style={styles.value}>{data.paymentMethod}</Text>
          </View>
        </View>

        {/* Conceptos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Concepto</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: '50%' }]}>
              Descripción
            </Text>
            <Text
              style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}
            >
              Cantidad
            </Text>
            <Text
              style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}
            >
              Precio Unit.
            </Text>
            <Text
              style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}
            >
              Total
            </Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { width: '50%', fontWeight: 'normal' },
                ]}
              >
                {item.description}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { width: '15%', textAlign: 'center', fontWeight: 'normal' },
                ]}
              >
                {item.quantity}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { width: '15%', textAlign: 'right', fontWeight: 'normal' },
                ]}
              >
                ${item.unitPrice.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { width: '20%', textAlign: 'right', fontWeight: 'normal' },
                ]}
              >
                ${item.total.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${data.subtotal.toFixed(2)}</Text>
          </View>
          {data.iva && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (16%):</Text>
              <Text style={styles.totalValue}>${data.iva.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>TOTAL:</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>
              ${data.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Este recibo es válido como comprobante de pago
          </Text>
          <Text style={styles.footerText}>Gracias por tu preferencia</Text>
        </View>

        {/* Marca de agua */}
        <Text style={styles.watermark}>{data.emitter.name}</Text>
      </Page>
    </Document>
  );
}
