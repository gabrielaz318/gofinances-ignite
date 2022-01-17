import { RFValue } from 'react-native-responsive-fontsize';
import styled from "styled-components/native";
import { TextInput } from "react-native";

export const Container = styled(TextInput)`
    width: 100%;
    padding: 18px 16px 14px 16px;

    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;

    color: ${({ theme }) => theme.colors.text_dark};
    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 5px;

    margin-bottom: 8px;
`;
