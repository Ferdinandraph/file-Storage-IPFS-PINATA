import axios from 'axios';

const JWT = process.env.REACT_APP_PINATA_JWT;

export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({ name: file.name });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({ cidVersion: 0 });
  formData.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `Bearer ${JWT}`
      }
    });

    const cid = res.data.IpfsHash;
    const name = file.name;

    // Save the CID on the server with the file name
    await axios.post('file-storage-ipfs-pinata-1-backend.onrender.com/api/save-cid', { cid, name }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return cid;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

export const getFile = async (cid) => {
  try {
    const res = await axios.get(`https://purple-defeated-mollusk-661.mypinata.cloud/ipfs/${cid}`, {
      responseType: 'blob'
    });
    const url = URL.createObjectURL(res.data);
    return { url, type: res.data.type };
  } catch (error) {
    console.error('Error retrieving file:', error);
    throw new Error('Failed to retrieve file');
  }
};
