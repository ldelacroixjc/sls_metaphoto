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
            const enrichedData = getEnrichedData(photos, albums, users);
            const filteredData = getFilteredData(enrichedData, params);
            const limit = params?.limit ? params.limit : 25;
            const offset = params?.offset ? params.offset : 0;
            const responseData = filteredData.slice(offset, limit);
            response = { status: 200, data: responseData}
        }
    } catch (error) {
        console.error('Error', error)
    }
    return response;
}

const getEnrichedData = (photos, albums, users) => {
    const enrichedData = photos.map( (photo) => {
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
    return enrichedData;
}

const getFilteredData = (data, params) => {
    let filteredData = data;
    if(params){
        const filters = [];
        if (params.title) {
            filters.push((photo) => photo.title.includes(params.title));
        }
        if (params['album.title']) {
            filters.push((photo) => photo.album.title.includes(params['album.title']));
        }
        if (params['album.user.email']) {
            filters.push((photo) => photo.album.user.email === params['album.user.email']);
        }
        filteredData= data.filter((photo) => filters.every((filter) => filter(photo)));
    }
    return filteredData;
}

module.exports = {
    getPhotos
}