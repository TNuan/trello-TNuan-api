import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dw4mluhwb',
  api_key: '771687392337691',
  api_secret: 'CLvjHBevNgtqJeUXV0Dww0NWmN4'
})

const uploadToCloudinary = async (path, folder = 'card-attchment') => {
  try {
    const data = await cloudinary.uploader.upload(path, { folder: folder })
    return { url: data.secure_url, publicId: data.public_id }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export { uploadToCloudinary }
