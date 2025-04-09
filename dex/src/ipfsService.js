import axios from 'axios';

const JWT = process.env.REACT_APP_PINATA_JWT;
const BackendUrl = process.env.REACT_APP_BACKEND_URL;

export const uploadFile = async (file, token, saveToBackend = true, txHash = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pinataMetadata', JSON.stringify({ name: file.name }));
  formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

  try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `Bearer ${JWT}`,
      },
    });

    const cid = res.data.IpfsHash;

    if (saveToBackend) {
      await axios.post(`${BackendUrl}/api/save-cid`, { cid, name: file.name, txHash }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    return cid;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

export const getFile = async (cid) => {
  try {
    const res = await axios.get(`https://purple-defeated-mollusk-661.mypinata.cloud/ipfs/${cid}`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(res.data);
    return { url, type: res.data.type };
  } catch (error) {
    console.error('Error retrieving file:', error);
    throw new Error('Failed to retrieve file');
  }
};