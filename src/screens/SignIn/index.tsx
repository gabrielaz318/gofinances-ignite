import React, { useState } from 'react'
import { Alert, ActivityIndicator, Platform } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from 'styled-components'

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'

import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles'

import { useAuth } from '../../hooks/auth'

import { SignInSocialButton } from '../../components/SignInSocialButton'

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const { user, signInWithGoggle, signInWithApple } = useAuth()
    const theme = useTheme()

    async function handleSignInWithGoggle() {
        try {
            setIsLoading(true)
            return await signInWithGoggle()
        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível conectar a conta Google', 'erro')
            setIsLoading(false)
        }
        
    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true)
            return await signInWithApple()
        } catch (error) {
            console.log(error)
            if(JSON.stringify(error).indexOf('platform=android')) {
                Alert.alert('Não foi possível conectar a conta Apple', 'Não é possível conectar a uma conta Apple utilizando um dispositivo Android.')
            } else {
                Alert.alert('Não foi possível conectar a conta Apple', 'Houve um erro ao tentar fazer login com uma conta Apple, tente novamente mais tarde ou entre em contato com o desenvolvedor.')
            }
            setIsLoading(false)
        }
            
    }


    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>

                    <SignInTitle>
                        Faça seu login com {'\n'}
                        uma das contas abaixo
                    </SignInTitle>
                </TitleWrapper>
            </Header>
            
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com o Google"
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoggle}
                        />

                    {Platform.OS !== 'android' && <SignInSocialButton
                        title="Entrar com Apple"
                        svg={AppleSvg}
                        onPress={handleSignInWithApple}
                    />}
                </FooterWrapper>

                { isLoading && <ActivityIndicator 
                                    style={{ marginTop: 18 }}
                                    color={theme.colors.shape} 
                                    size='large' 
                                /> }
            </Footer>
        </Container>
    )
}