import { RFValue } from 'react-native-responsive-fontsize';
import styled from "styled-components/native";
import { RectButton } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons'

export const Container = styled(RectButton)`
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    padding: 18px 16px 15px 16px;
    margin-top: 8px;
`

export const Category = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${RFValue(14)}px;
`;

export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    color: ${({ theme }) => theme.colors.text};
`;