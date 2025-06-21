// Onboarding.tsx
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { useState } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const slides = [
    { id: 1, image: require('../assets/images/onboarding/onboarding1.png'), color: '#4CAF50' },
    { id: 2, image: require('../assets/images/onboarding/onboarding2.png'), color: '#3DF7D6' },
    { id: 3, image: require('../assets/images/onboarding/onboarding3.png'), color: '#66B9EB' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* shared values */
  const translateX = useSharedValue(0);
  const indexSV    = useSharedValue(0);
  const buttonOp   = useSharedValue(1);

  /* ───────────────────────── gestures ───────────────────────── */
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = -(currentSlide * SCREEN_WIDTH) + e.translationX;
    })
    .onEnd((e) => {
      const travel = e.translationX;
      const shouldMove = Math.abs(travel) > SCREEN_WIDTH / 3;
      const goingLeft  = travel < 0;
      const nextIndex  = goingLeft ? currentSlide + 1 : currentSlide - 1;

      if (shouldMove && nextIndex >= 0 && nextIndex < slides.length) {
        runOnJS(setCurrentSlide)(nextIndex);
        indexSV.value = withSpring(nextIndex);
        translateX.value = withSpring(-nextIndex * SCREEN_WIDTH);
      } else {
        translateX.value = withSpring(-currentSlide * SCREEN_WIDTH);
      }
    });

  /* ───────────────────── animated styles ───────────────────── */
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(indexSV.value, [0, 1, 2], slides.map((s) => s.color)),
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOp.value }));

  /* ────────────────────── nav handlers ─────────────────────── */
  const goTo = (i: number) => {
    setCurrentSlide(i);
    indexSV.value   = withSpring(i);
    translateX.value = withSpring(-i * SCREEN_WIDTH);
  };

  const next = () => {
    if (currentSlide < slides.length - 1) goTo(currentSlide + 1);
    else {
      buttonOp.value = withTiming(0, { duration: 300 });
      setTimeout(onDone, 300);
    }
  };

  const prev = () => currentSlide > 0 && goTo(currentSlide - 1);
  const skip = () => {
    buttonOp.value = withTiming(0, { duration: 300 });
    setTimeout(onDone, 300);
  };

  /* ────────────────────────── ui ───────────────────────────── */
  return (
    <GestureHandlerRootView className="flex-1">
      <Animated.View className="flex-1" style={bgStyle}>
        {/* Skip */}
        <AnimatedPressable
          onPress={skip}
          className="absolute top-16 right-8 z-10 rounded-full px-4 py-2"
          style={buttonStyle}
        >
          <Text className="text-white font-bold">Skip</Text>
        </AnimatedPressable>

        {/* Slides */}
        <GestureDetector gesture={pan}>
          <Animated.View
            className="flex-row h-full"
            style={[{ width: SCREEN_WIDTH * slides.length }, sliderStyle]}
          >
            {slides.map((s) => (
              <View key={s.id} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
                <Image source={s.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>
            ))}
          </Animated.View>
        </GestureDetector>

        {/* Bottom controls */}
        <Animated.View className="absolute bottom-10 w-full px-6" style={buttonStyle}>
          {/* dots */}
          <View className="flex-row justify-center mb-6">
            {slides.map((_, i) => (
              <Pressable key={i} onPress={() => goTo(i)}>
                <View
                  className={`mx-2 rounded-full ${currentSlide === i ? 'w-8 bg-white h-3' : 'w-3 bg-white/50 h-3'}`}
                />
              </Pressable>
            ))}
          </View>

          {/* nav buttons */}
          <View className="flex-row items-center justify-between">
            {currentSlide > 0 ? (
              <AnimatedPressable onPress={prev} className="bg-white/30 rounded-full px-6 py-4">
                <Text className="text-white text-lg font-bold">←</Text>
              </AnimatedPressable>
            ) : (
              <View /> /* placeholder to keep layout balanced */
            )}

            <AnimatedPressable
              onPress={next}
              className={`rounded-full px-6 py-4 ml-auto 
                ${ currentSlide === slides.length - 1 ? 'bg-white' : 'bg-white/30' }
                !bg-white
              `}
            >
              <Text
                className={`text-lg font-bold 
                    ${ currentSlide === slides.length - 1 ? 'text-gray-700' : 'text-white'}
                    !text-gray-700
                `}
              >
                {currentSlide === slides.length - 1 ? 'Get Started →' : 'Next →'}
              </Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
