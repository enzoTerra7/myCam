import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera'
import { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons'

export default function App() {

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const camRef = useRef(null)

  const [type, setType] = useState(CameraType.back)
  const [photo, setPhoto] = useState(null)
  const [open, setOpen] = useState(false)

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setOpen(true)
      setPhoto(data.uri)
    }
  }

  useEffect(() => {
    requestPermission()
  }, [])

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return <Text>
      Por favor, habilite sua camera para prosseguir
    </Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={camRef}
      >
        <View style={styles.containerBtns}>
          <TouchableOpacity onPress={toggleCameraType} style={styles.flipBtn}>
            <FontAwesome name="exchange" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.photoBtn}>
            <FontAwesome name="camera" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </Camera>
      {photo && (
        <Modal
          animationType='slide'
          transparent={true}
          visible={open}
        >
          <View
            style={styles.modalContainer}
          >
            <Image
              style={styles.photo}
              source={{uri: photo}}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOpen(false)}
            >
              <FontAwesome name="close" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  containerBtns: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  flipBtn: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoBtn: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 20
  },
  photo: {
    width: '100%',
    height: 400
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
