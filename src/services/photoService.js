const request = require('./requestService')
const utils = require('../utils/utils')

const getPhotos = async (params) => {
    let response = null
    try {
        const PHOTOS_URL = `${process.env.API_URL}/photos`;
        const ALBUMS_URL =  `${process.env.API_URL}/albums`;
        const USERS_URL =  `${process.env.API_URL}/users`;

        const [photosResponse, albumsResponse, usersResponse] = await Promise.all([
            request.getData(PHOTOS_URL),
            request.getData(ALBUMS_URL),
            request.getData(USERS_URL)
        ])

        if( 
            photosResponse.status === 200 && 
            albumsResponse.status === 200 && 
            usersResponse.status === 200
        ){
            const photos = photosResponse.data;
            const users = utils.convertToMap(usersResponse.data);
            const albums = utils.convertToMap(albumsResponse.data);
            let responseData = photos.map( (photo) => {
                const albumData = albums[photo.albumId];
                const userData = users[albumData.userId];
                return {
                    id: photo.id,
                    title: photo.title,
                    url: photo.url,
                    thumbnailUrl: photo.thumbnailUrl,
                    album: {
                        id: albumData.id,
                        title: albumData.title,
                        user: {
                            ...userData
                        }
                    }
                }
            })
            responseData = params && params?.title 
                ? responseData.filter((photo) => photo.title.includes(params.title)) 
                : responseData;
            responseData = params && params['album.title']
                ? responseData.filter((photo) => photo.album.title.includes(params['album.title'])) 
                : responseData;
            responseData = params && params['album.user.email']
                ? responseData.filter((photo) => photo.album.user.email === params['album.user.email']) 
                : responseData;
            const limit = params?.limit ? params.limit : 25;
            const offset = params?.offset ? params.offset : 0;
            responseData = responseData.slice(offset, limit);
            response = { status: 200, data: responseData}
        }
    } catch (error) {
        console.error('Error', error)
    }
    return response;
}

module.exports = {
    getPhotos
}