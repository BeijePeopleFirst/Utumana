package com.peoplefirst.motorino.datasource;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;


@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.peoplefirst.motorino.destinazione.repository",  // Aggiunto per trovare il repository
        entityManagerFactoryRef = "destinazioneEntityManagerFactory",
        transactionManagerRef = "destinazioneTransactionManager"
)
public class DestinazioneDataSourceConfig {

    @Bean(name = "destinazioneDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.destinazione")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "destinazioneEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder builder, @Qualifier("destinazioneDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.peoplefirst.motorino.destinazione.model") // Package corretto delle entità
                .persistenceUnit("destinazione")
                .build();
    }

    @Bean(name = "destinazioneTransactionManager")
    public PlatformTransactionManager transactionManager(
            @Qualifier("destinazioneEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}