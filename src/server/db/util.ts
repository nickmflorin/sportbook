type PostgresConnectionStringParams = {
  readonly password: string;
  readonly user: string;
  readonly port: string | number;
  readonly host: string;
  readonly name: string;
};

export const postgresConnectionString = ({
  host,
  user,
  password,
  name,
  port,
}: PostgresConnectionStringParams): string => `postgresql://${user}:${password}` + `@${host}:${port}/${name}`;
