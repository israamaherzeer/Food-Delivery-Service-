export namespace NSUser {
    export enum UserType {
        restaurant = "restaurant",
        customer = "customer",
        driver = "driver",
    }

    export interface IUser {
        _id: string;
        email: string;
        password: string;
        createdAt: Date;
        role: UserType,
    }

    export interface ICustomer {
        email: string;
        password: string;
        full_name: string,
        phone_number: string,
    }

    export enum vehicleType {
        bike = 'bike',
        car = 'car',
        scooter = 'scooter',
        other = 'other'
    }

    export interface IDriver {
        email: string;
        password: string;
        full_name: string,
        phone_number: string,
        availability: boolean,
        vehicle_type: vehicleType,
        city: string,
    }

    export interface IRestaurant {
        name: string,
        phone_number: string,
        email: string;
        password: string;
        location: string,
        opening_time: string,
        closing_time: string,
        categories: string []
    }
}