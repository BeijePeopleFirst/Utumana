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

/**
 * @author Mattia Pagani
 * Data source del DB di destinazione
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.peoplefirst.motorino.destinazione.repository",
        entityManagerFactoryRef = "destinazioneEntityManagerFactory",
        transactionManagerRef = "destinazioneTransactionManager"
)
public class DestinazioneDataSourceConfig {

    /**
     * Recupera dall'application.properties i dati giusti per il db
     * @return DataSource autogenerato basato sulla property inserita
     */
    @Bean(name = "destinazioneDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.destinazione")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    /**
     * Genera il destinazioneEntityManagerFactory basandosi sul dataSource precedentemente creato,
     * sui model di esso (indicati tramite i packages) e il nome del db
     * @param builder builder per l'entity manager factory
     * @param dataSource DataSource generato dal metodo precedente
     * @return destinazioneEntityManagerFactory
     */
    @Bean(name = "destinazioneEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("destinazioneDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.peoplefirst.motorino.destinazione.model")
                .persistenceUnit("destinazione")
                .build();
    }

    /**
     * Crea un transaction manager per il db di destinazione
     * @param entityManagerFactory bean generato precedentemente
     * @return destinazioneTransactionManager
     */
    @Bean(name = "destinazioneTransactionManager")
    public PlatformTransactionManager transactionManager(
            @Qualifier("destinazioneEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}