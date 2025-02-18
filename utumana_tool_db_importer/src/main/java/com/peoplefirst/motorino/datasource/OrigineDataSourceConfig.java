package com.peoplefirst.motorino.datasource;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/**
 * @author Mattia Pagani
 * Data source del DB di origine (Primario)
 */
//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        basePackages = "com.peoplefirst.motorino.origine.repository",
//        entityManagerFactoryRef = "origineEntityManagerFactory",
//        transactionManagerRef = "origineTransactionManager"
//)
//public class OrigineDataSourceConfig {
//
//    /**
//     * Recupera dall'application.properties i dati giusti per il db
//     * @return DataSource autogenerato basato sulla property inserita
//     */
//    @Primary
//    @Bean(name = "origineDataSource")
//    @ConfigurationProperties(prefix = "spring.datasource.origine")
//    public DataSource dataSource() {
//        return DataSourceBuilder.create().build();
//    }
//
//    /**
//     * Genera il origineEntityManagerFactory basandosi sul dataSource precedentemente creato,
//     * sui model di esso (indicati tramite i packages) e il nome del db
//     * @param builder builder per l'entity manager factory
//     * @param dataSource DataSource generato dal metodo precedente
//     * @return origineEntityManagerFactory
//     */
//    @Primary
//    @Bean(name = "origineEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("origineDataSource") DataSource dataSource) {
//        return builder
//                .dataSource(dataSource)
//                .packages("com.peoplefirst.motorino.origine.model")
//                .persistenceUnit("origine")
//                .build();
//    }
//
//    /**
//     * Crea un transaction manager per il db di origine
//     * @param entityManagerFactory bean generato precedentemente
//     * @return origineTransactionManager
//     */
//    @Primary
//    @Bean(name = "origineTransactionManager")
//    public PlatformTransactionManager transactionManager(
//            @Qualifier("origineEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
//        return new JpaTransactionManager(entityManagerFactory);
//    }
//}

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.peoplefirst.motorino.origine.repository",  // Aggiunto per trovare il repository
        entityManagerFactoryRef = "origineEntityManagerFactory",
        transactionManagerRef = "origineTransactionManager"
)
public class OrigineDataSourceConfig {

    @Primary
    @Bean(name = "origineDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.origine")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean(name = "origineEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder builder, @Qualifier("origineDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.peoplefirst.motorino.origine.model") // Package corretto delle entità
                .persistenceUnit("origine")
                .build();
    }

    @Primary
    @Bean(name = "origineTransactionManager")
    public PlatformTransactionManager transactionManager(
            @Qualifier("origineEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}