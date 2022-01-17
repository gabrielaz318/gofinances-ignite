import React, { useEffect, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ActivityIndicator } from 'react-native'

import { useAuth } from '../../hooks/auth'
import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';

import { HistoryCard } from '../../components/HistoryCard';

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';
import { categories } from '../../utils/categories';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    name: string;
    totalFormatted: string;
    total: number;
    color: string;
    key: string;
    percent: string;
}

export function Resume() {
    const [isLoading, setIsLoading] = useState(false)
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const { user } = useAuth()

    const theme = useTheme()

    function handleDateChange(action: 'next' | 'prev') {
        if(action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        } else {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    async function loadData() {
        setIsLoading(true)
        const dataKey = `@gofinances:transactions_user:${user.id}`
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : []    

        const expensives = responseFormatted
        .filter((expensive: TransactionData) => 
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        )

        const expensivesTotal = expensives
        .reduce((acumulator: number, expensive: TransactionData) => {
            return acumulator + Number(expensive.amount)
        },0)
        
        const totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let categorySum = 0

            expensives.forEach((expensive: TransactionData) => {
                if(expensive.category === category.key) {
                    categorySum += Number(expensive.amount)
                }
            })

            if(categorySum > 0) {
                const total = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    name: category.name,
                    totalFormatted: total,
                    total: categorySum,
                    color: category.color,
                    key: category.key,
                    percent
                })
            }
        })

        setTotalByCategories(totalByCategory)
        setIsLoading(false)
    }   

    useFocusEffect(useCallback(() => {
        loadData();
    },[selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {
                isLoading 
                ? 
                <LoadContainer>
                    <ActivityIndicator size='large' color={theme.colors.primary} />
                </LoadContainer> 
                :
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: 50,
                    }}
                >
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>

                        <Month>
                            { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
                        </Month>

                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>

                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            x="percent"
                            y="total"
                            style={{
                                labels: { 
                                    fontSize: RFValue(15),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape
                                }
                            }}
                            labelRadius={110}
                            colorScale={totalByCategories.map(category => category.color)}
                        />
                    </ChartContainer>

                    {
                        totalByCategories.map(item => (
                            <HistoryCard
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                            />
                        ))
                    }
                </Content>
            }
        </Container>
    )
}