const auth = {
  GET_USER_UID: ({ id }) => `
    SELECT
      uid
    FROM USER
    WHERE id = '${id}';
  `,
  GET_USER_COUNT: ({ id }) => `
    SELECT
      COUNT(*) AS count
    FROM USER
    WHERE ID = '${id}';
  `,
  INSERT_USER: ({ id }) => `
    INSERT
      INTO USER (ID)
      VALUES ('${id}');
  `,
  GET_TOWN: ({ town }) => `
    SELECT
      ID as townID
    FROM TOWN
    WHERE name = '${town}';
  `,
  GET_TOWN_LIST_COUNT: ({ uid }) => `
    SELECT
      COUNT(*) AS townListCount
    FROM TOWN_LIST
    WHERE USER_UID = '${uid}';
  `,
  GET_TOWN_BY_UID: ({ uid }) => `
    SELECT
      TOWN_LIST.TOWN_ID AS id,
      TOWN_LIST.is_active AS isActive,
      TOWN.name AS name
    FROM TOWN_LIST
    LEFT JOIN TOWN
      ON TOWN_LIST.TOWN_ID = TOWN.ID
    WHERE TOWN_LIST.USER_UID = '${uid}'
  `,
  GET_TOWN_LIST_IS_ACTIVE_COUNT: ({ uid }) => `
      SELECT 
        COUNT(*) AS isActiveCount  
      FROM TOWN_LIST
      WHERE USER_UID = '${uid}' AND is_active = 1
  `,
  INSERT_TOWN: ({ town }) => `
    INSERT
      INTO TOWN (name)
      VALUES ('${town}');
  `,
  INSERT_TOWN_LIST: ({ townID, uid, isActive }) => `
    INSERT
      INTO TOWN_LIST (TOWN_ID, USER_UID, is_active)
      VALUES(${townID}, ${uid}, ${isActive});
  `,
  DELETE_TOWN_LIST: ({ townID, uid }) => `
    DELETE FROM TOWN_LIST 
      WHERE TOWN_ID = ${townID} 
      AND USER_UID = ${uid};
  `,
  DELETE_TOWN: ({ townID }) => `
    DELETE FROM TOWN 
      WHERE ID = ${townID}
  `
};

const products = {
  GET_PRODUCT_LIST: ({ type, uid, category, town }) => `
    SELECT
      PRODUCT.ID AS id,
      PRODUCT.name AS name,
      PRODUCT.timecreated AS timeCreated,
      PRODUCT.price AS price,
      PRODUCT.USER_UID AS userId,
      TOWN.name AS town,
      (SELECT
      image_url
    FROM PRODUCT_IMAGES
    WHERE
      PRODUCT_ID = PRODUCT.ID
    ORDER BY timecreated ASC
    LIMIT 1
    ) AS thumbnail,
    (SELECT
      COUNT(*)
    FROM LIKE_LIST
    WHERE
      PRODUCT_ID = PRODUCT.ID
    ) AS likeCount,
    (SELECT
      USER_UID
    FROM LIKE_LIST
      WHERE (
      USER_UID = ${uid} AND PRODUCT_ID = PRODUCT.ID
      )
    ) AS isLiked
    FROM PRODUCT
    LEFT JOIN TOWN
      ON PRODUCT.TOWN_ID = TOWN.ID
    ${getAdditionalQuery(type, { town, uid, category })}
  `,
  GET_PRODUCT: ({ uid, pid }) => `
    SELECT
      PRODUCT.ID AS id,
      PRODUCT.name AS name,
      PRODUCT.timecreated AS timeCreated,
      PRODUCT.price AS price,
      PRODUCT.USER_UID AS userId,
      PRODUCT.category,
      PRODUCT.content,
      PRODUCT.status,
      TOWN.name AS town,
      USER.id AS seller,
      (SELECT
        COUNT(*)
      FROM LIKE_LIST
      WHERE
        PRODUCT_ID = PRODUCT.ID
      ) AS likeCount,
      (SELECT
        USER_UID
      FROM LIKE_LIST
        WHERE (
          USER_UID = ${uid}
          AND PRODUCT_ID = PRODUCT.ID
        )
      ) AS isLiked
    FROM PRODUCT
    LEFT JOIN TOWN
      ON PRODUCT.TOWN_ID = TOWN.ID
    LEFT JOIN USER
      ON PRODUCT.USER_UID = USER.UID
    WHERE
      PRODUCT.ID = ${pid}
  `,
  GET_PRODUCT_IMAGES: ({ pid }) => `
    SELECT
      image_url AS imageUrl
    FROM PRODUCT_IMAGES
    WHERE
      PRODUCT_ID = ${pid}
  `,
  INSERT_PRODUCT: ({ name, categoryID, content, price, uid }) => `
    INSERT 
      INTO PRODUCT (name, category, content, price, USER_UID, TOWN_ID) 
      VALUES('${name}', '${categoryID}', '${content}', ${price}, ${uid}, (
        SELECT TOWN_ID 
        FROM TOWN_LIST 
        WHERE USER_UID = ${uid} 
          AND is_active = 1)
      )
  `
};

const getAdditionalQuery = (type, { town, uid, category }) => {
  switch (type) {
    case 'town':
      return `
        WHERE
          TOWN_ID = 
          ${town || `
          (
            SELECT 
              TOWN_ID 
            FROM TOWN_LIST 
              WHERE
                USER_UID = ${uid}
                AND is_active=true
          )
          `}
          AND PRODUCT.status = 'onsale'
          ${
            category
            ? `AND PRODUCT.category = '${category}'`
            : ''
          }
      `;
    case 'sale':
      return `
        WHERE
          PRODUCT.USER_UID = ${uid}
      `;
    case 'liked':
      return `
        INNER JOIN LIKE_LIST
          ON LIKE_LIST.PRODUCT_ID = PRODUCT.ID
        WHERE
          LIKE_LIST.USER_UID = ${uid}
      `;
    default:
      return '';
  }
};

const QUERY = {
  auth,
  products
};

const createQuery = (name, params) => {
  const [domain, query] = name.split('/');

  return QUERY[domain][query](params);
};

export default createQuery;
