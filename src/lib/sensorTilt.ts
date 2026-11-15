/** Must be called directly from a click on iOS. Permission is never requested at boot. */
export async function requestSensorTilt():Promise<boolean>{
 const api=globalThis.DeviceOrientationEvent as typeof DeviceOrientationEvent&{requestPermission?:()=>Promise<string>};
 if(!api)return false;try{return api.requestPermission?await api.requestPermission()==='granted':true;}catch{return false;}
}
