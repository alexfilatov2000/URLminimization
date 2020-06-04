CREATE OR REPLACE PROCEDURE transfer()
-- is it used? Why you need transfer procedure?
AS $$
BEGIN
    create table if not exists users
(
	id serial not null
		constraint users_pk
			primary key,
	email varchar(255) not null,
-- 	wrong size, mail not limites to 255
	password varchar(255) not null
);


create table if not exists redirection
(
	id serial not null
		constraint redirection_pk
			primary key,
	country_code varchar(255),
-- 	wrong size, code isn't so long
	device_type varchar(255),
-- 	the same in all fileds
	redirection_type varchar(255),
	long_url varchar(255),
	short_url varchar(255)
-- 	date\time filed missing
-- 	no origin ip filed
-- 	no useragent field
-- 	no link to urlschema
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
