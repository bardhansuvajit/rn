import { View } from 'react-native'
import { Tabs } from 'expo-router'
import { SvgXml } from 'react-native-svg'
import { useColorScheme } from 'nativewind'
import colors from 'tailwindcss/colors'
import { homeIcon, categoryIcon, cartIcon, profileIcon, homeIconActive, categoryIconActive, cartIconActive, profileIconActive } from '@utils/svgIcons';

interface TabBarIconProps {
    focused: boolean
    activeXml: string
    inactiveXml: string
}

const TabBarIcon = ({ focused, activeXml, inactiveXml }: TabBarIconProps) => {
    const { colorScheme } = useColorScheme()
    const activeColor = colorScheme === 'dark' ? colors.green[700] : colors.green[500]
    const inactiveColor = colors.gray[400]

    return (
        <SvgXml
        xml={focused ? activeXml : inactiveXml}
        width={24}
        height={24}
        color={focused ? activeColor : inactiveColor}
        />
    )
}

export default function Layout() {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? colors.green[700] : colors.green[500],
          tabBarInactiveTintColor: colors.gray[400],
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            marginBottom: 4,
          },
          tabBarStyle: {
            height: 70,
            paddingTop: 1,
            paddingBottom: 20,
            backgroundColor: isDark ? colors.gray[900] : colors.white,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            shadowOffset: { height: 0, width: 0 },
            shadowColor: 'transparent',
            borderTopColor: 'transparent',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                activeXml={homeIconActive}
                inactiveXml={homeIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: 'Category',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                activeXml={categoryIconActive}
                inactiveXml={categoryIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                activeXml={cartIconActive}
                inactiveXml={cartIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                activeXml={profileIconActive}
                inactiveXml={profileIcon}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  )
}