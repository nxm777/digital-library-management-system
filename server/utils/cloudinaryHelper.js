const getPublicIdFromUrl = (url) => {
    try {
        const splitUrl = url.split('/');
        const filenameWithExtension = splitUrl[splitUrl.length - 1];
        const folder = splitUrl[splitUrl.length - 2];
        
        const publicId = filenameWithExtension.split('.')[0];
        
        return `${folder}/${publicId}`; 
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
};