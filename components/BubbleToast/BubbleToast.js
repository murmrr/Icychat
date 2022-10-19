import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import { scale } from "../../utility/scalingUtils";

const BubbleToast = ({
  text,
  fontSize,
  width,
  top = undefined,
  bottom = undefined,
  left = undefined,
  right = undefined,
  visible,
  setVisible,
}) => {
  const [fade] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(fade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1000);
      setTimeout(() => {
        setVisible(false);
      }, 1500);
    }
  }, [visible]);

  return visible ? (
    <Animated.View style={styles.animatedContainer(fade)}>
      <View style={styles.copy(width, top, bottom, left, right)}>
        <Text style={[styles.copyText, { fontSize: fontSize }]}>{text}</Text>
        <View style={styles.copyTriangle(width)} />
      </View>
    </Animated.View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  animatedContainer: (opacity) => ({
    position: "absolute",
    zIndex: 1,
    opacity: opacity,
  }),
  copy: (width, top, bottom, left, right) => ({
    position: "absolute",
    backgroundColor: colors.BLUE,
    width: width,
    height: 0.428571429 * width,
    borderRadius: 4,
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  }),
  copyText: {
    color: colors.WHITE,
    fontFamily: "Poppins-Medium",
    zIndex: 0,
  },
  copyTriangle: (width) => ({
    borderTopWidth: 0.228571429 * width,
    borderRightWidth: 0.228571429 * width,
    borderBottomWidth: 0,
    borderLeftWidth: 0.228571429 * width,
    borderTopColor: colors.BLUE,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
    top: 0.428571429 * width - 1,
    zIndex: -1,
  }),
});

export default BubbleToast;
