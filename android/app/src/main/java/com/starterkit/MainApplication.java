package com.starterkit;

import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

import com.actionsheet.ActionSheetPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.magus.fblogin.FacebookLoginPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;

import RNAssetResizeToBase64.RNAssetResizeToBase64Package;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebasePackage(),
            //new RNFirebasePackage(),
              new MPAndroidChartPackage(),
            new ActionSheetPackage(),
            new PickerPackage(),
            new FIRMessagingPackage(),
            new RNAssetResizeToBase64Package(),
            new FacebookLoginPackage(),
            new RNFSPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new GoogleAnalyticsBridgePackage(),
            new RNDeviceInfo()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    try {
      PackageInfo info = getPackageManager().getPackageInfo(
              getPackageName(),
              PackageManager.GET_SIGNATURES);
      for (Signature signature : info.signatures) {
        MessageDigest md = MessageDigest.getInstance("SHA");
        md.update(signature.toByteArray());
        Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
      }
    }
    catch (PackageManager.NameNotFoundException e) {

    }
    catch (NoSuchAlgorithmException e) {

    }


    SoLoader.init(this, /* native exopackage */ false);
  }
}
