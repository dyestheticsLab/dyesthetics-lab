import { container as globalRegistryTsyringe } from "tsyringe";

export { globalRegistryTsyringe };

export const GET_PAGE_BY_SLUG = Symbol.for("getPageBySlug");

globalRegistryTsyringe.register(GET_PAGE_BY_SLUG, {
    useFactory: () => {
        return (slug: string) => {

            console.log("🦝 ~ return ~ slug:", slug);

            return [{ contentType: "Button", title: "DESDE SERVICE TSYRINGE...!" }];
            
        };
    }
});
