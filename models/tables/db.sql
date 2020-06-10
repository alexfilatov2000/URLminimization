CREATE OR REPLACE PROCEDURE transfer()
AS $$
BEGIN
    create table if not exists users
(
	id serial not null
		constraint users_pk
			primary key,
	email varchar(255) not null,
	password varchar(255) not null
);

create table if not exists redirection
(
	id serial not null
    		constraint redirection_pk
    			primary key,
    country_code varchar(10),
   	device_type varchar(20),
   	redirection_type varchar(20),
   	long_url varchar(255),
   	short_url varchar(100),
   	ip_address varchar(50),
   	user_agent varchar,
   	email varchar(70)
);

create table if not exists tokens
(
	id serial not null
		constraint tokens_pk
			primary key,
	rtoken varchar(255)
);

create table if not exists urlshema
(
	id serial not null
		constraint urlshema_pk
			primary key,
	longurl varchar(255) not null,
	urlcode varchar(255) not null
);

END;
$$ LANGUAGE plpgsql;
