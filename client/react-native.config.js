module.exports = {
    "react-native-vector-icons":{
        platform  : {
            ios : null,
            android : {}
        }
    },
    assets : ['./src/assets/fonts/'],
    getTransformModulePath(){
        return require.resolve('react-native-typescript-transformer');
    },
    getSourceExts(){
        return ['.ts', '.tsx'];
    }
}