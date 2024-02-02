import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const InteractiveTable = () => {
  const [data, setData] = useState([]);

  const navigateToProcessPage = (studyAccession) => {
    window.location.href = `/process`;
  };

  useEffect(() => {
    fetch('/ancestry_sample_size.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Convert stringified arrays to actual arrays and store only the first element
            const processedData = results.data.map(row => ({
              ...row,
              'Processed_Ancestries': row['Processed_Ancestries'].split(';')[0].trim(),
              'Processed_Sample_Sizes': row['Processed_Sample_Sizes'].split(';')[0].trim()
            }));
            setData(processedData);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching the CSV file:', error);
      });
  }, []);

  // Define some basic styles with horizontal padding
  const styles = {
    link: {
      color: '#1a0dab', // Google blue link color
      textDecoration: 'none'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    th: {
      background: '#333',
      color: 'white',
      fontWeight: 'bold',
      padding: '10px',
      border: '1px solid #ddd'
    },
    td: {
      padding: '8px',
      textAlign: 'left',
      border: '1px solid #ddd'
    },
    container: {
      margin: '20px auto',
      padding: '0 20px',
      maxWidth: '1200px'
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Disease/Trait</th>
            <th style={styles.th}>Ancestry</th>
            <th style={styles.th}>Sample Size</th>
            <th style={styles.th}>Study Accession</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={styles.td}>{row['DISEASE/TRAIT']}</td>
              <td style={styles.td}>{row['Processed_Ancestries']}</td>
              <td style={styles.td}>{row['Processed_Sample_Sizes']}</td>
              <td style={styles.td}>
                <a
                  href={`/process/${row['STUDY ACCESSION']}`}
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToProcessPage(row['STUDY ACCESSION']);
                  }}
                >
                  {row['STUDY ACCESSION']}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InteractiveTable;